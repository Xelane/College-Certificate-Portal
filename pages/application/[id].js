import { useRouter } from 'next/router';
import { MongoClient } from 'mongodb';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { useEffect, useState } from 'react';
import AWS from 'aws-sdk';

// Initialize S3 client
const s3 = new AWS.S3({
  region: process.env.REGION, // Make sure this is set correctly
});

const ApplicationDetails = ({ applicationData }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (applicationData) {
      setIsLoading(false);
      generateAndOpenPDF();
    } else {
      setIsLoading(false);
      setError('Application data not found.');
    }
  }, [applicationData]);

  const fetchFileFromS3 = async (key) => {
    try {
      const bucketName = process.env.S3_BUCKET_NAME;
      if (!bucketName) {
        throw new Error('S3 bucket name is not defined in environment variables.');
      }

      const params = {
        Bucket: bucketName,
        Key: key,
      };

      const { Body } = await s3.getObject(params).promise();
      return Body;
    } catch (error) {
      console.error('Error fetching file from S3:', error);
      setError(`Error fetching file from S3: ${error.message}`);
      throw error;
    }
  };

  const generateAndOpenPDF = async () => {
    if (!applicationData) {
      setError('Application data is missing.');
      return;
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([650, 1000]);
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const titleFontSize = 20;
    const labelFontSize = 12;
    const valueFontSize = 12;
    const margin = 50;
    const labelColumnWidth = 200;
    const valueColumnX = margin + labelColumnWidth + 20;
    let yPosition = height - margin;

    page.drawText('Leaving Certificate Form', {
      x: margin,
      y: yPosition,
      size: titleFontSize,
      font: boldFont,
      color: rgb(0, 0.53, 0.71),
    });
    yPosition -= 40;

    const drawSectionHeader = (text) => {
      yPosition -= 20;
      page.drawText(text, {
        x: margin,
        y: yPosition,
        size: labelFontSize + 2,
        font: boldFont,
        color: rgb(0, 0.2, 0.5),
      });
      yPosition -= 20;
    };

    const drawField = (label, value) => {
      if (yPosition < 50) {
        page.addPage([650, 1000]);
        yPosition = height - margin;
      }

      page.drawText(`${label}:`, {
        x: margin,
        y: yPosition,
        size: labelFontSize,
        font: boldFont,
        color: rgb(0.1, 0.1, 0.1),
      });

      const sanitizedValue = (value || 'N/A').replace(/[\r\n]+/g, ' ');
      const words = sanitizedValue.split(' ');

      let line = '';
      words.forEach((word) => {
        const testLine = line ? `${line} ${word}` : word;
        const textWidth = font.widthOfTextAtSize(testLine, valueFontSize);

        if (textWidth < (width - margin - valueColumnX)) {
          line = testLine;
        } else {
          page.drawText(line, {
            x: valueColumnX,
            y: yPosition,
            size: valueFontSize,
            font,
            color: rgb(0, 0, 0),
          });
          yPosition -= 15;
          line = word;
        }
      });

      if (line) {
        page.drawText(line, {
          x: valueColumnX,
          y: yPosition,
          size: valueFontSize,
          font,
          color: rgb(0, 0, 0),
        });
        yPosition -= 20;
      }
    };

    drawSectionHeader('Basic Information');
    drawField('Name of Student', applicationData.name);
    drawField('Mr./Mrs.', applicationData.mrOrMrs);
    drawField('Faculty/School Name', applicationData.facultySchool);
    drawField('Class', applicationData.className);
    drawField('Program', applicationData.program);
    drawField('PRN No', applicationData.prnNo);
    drawField('Result', applicationData.result);
    drawField('Year of Passing', applicationData.yearOfPassing);

    drawSectionHeader('Application Details');
    drawField('Reason for Applying', applicationData.reasonForApplying);
    drawField('Previous School/College', applicationData.previousSchool);
    drawField('Previous Course', applicationData.previousCourse);
    drawField('Previous College Passing Year', applicationData.previousCollegePassingYear);
    drawField('Date of Admission at MIT-WPU', applicationData.dateOfAdmission);
    drawField('Date of Last Attendance at MIT-WPU', applicationData.dateOfLastAttendance);

    drawSectionHeader('Personal Details');
    drawField('Date of Birth', applicationData.dateOfBirth);
    drawField('State, Place of Birth', applicationData.statePlaceOfBirth);
    drawField('Nationality', applicationData.nationality);
    drawField('Religion', applicationData.religion);
    drawField('Caste and Sub Caste', applicationData.casteSubCaste);
    drawField('Permanent Address', applicationData.permanentAddress);
    drawField('Email ID', applicationData.email);
    drawField('Mobile Number', applicationData.mobileNumber);
    drawField("Mother's Name", applicationData.mothersName);
    drawField('Alternate Mobile Number', applicationData.alternateMobileNumber);

    const pdfFiles = [
      applicationData.Prov_Cert,
      applicationData.Marksheet,
      applicationData.Fee_Receipt,
      applicationData.Prev_LC,
    ];

    for (const filePath of pdfFiles) {
      try {
        const fileData = await fetchFileFromS3(filePath);
        const externalPdf = await PDFDocument.load(fileData);
        const copiedPages = await pdfDoc.copyPages(externalPdf, externalPdf.getPageIndices());
        copiedPages.forEach(page => pdfDoc.addPage(page));
      } catch (error) {
        console.error(`Failed to load PDF from S3: ${filePath}`, error);
      }
    }

    try {
      const imagePath = applicationData.ID_Card;
      const imageBytes = await fetchFileFromS3(imagePath);

      const imageExtension = imagePath.split('.').pop().toLowerCase();

      let image;
      if (imageExtension === 'jpg' || imageExtension === 'jpeg') {
        image = await pdfDoc.embedJpg(imageBytes);
      } else if (imageExtension === 'png') {
        image = await pdfDoc.embedPng(imageBytes);
      } else {
        throw new Error('Unsupported image format');
      }

      const imageWidth = image.width;
      const imageHeight = image.height;

      const fixedHeight = 150;
      const scale = fixedHeight / imageHeight;

      const scaledWidth = imageWidth * scale;

      const imageX = (width - scaledWidth) / 2;
      const imageY = yPosition - fixedHeight - 30;

      page.drawImage(image, {
        x: imageX,
        y: imageY,
        width: scaledWidth,
        height: fixedHeight,
      });
    } catch (error) {
      console.error('Failed to load image from S3:', error);
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);

    window.location.href = blobUrl;
  };

  if (isLoading) {
    return <div>Loading Application Details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return null;
};

export async function getServerSideProps(context) {
  const { id } = context.params;

  const mongoURI = process.env.MONGODB_URI;
  const client = await MongoClient.connect(mongoURI);
  const db = client.db('test');
  const collection = db.collection('formdatas');

  try {
    const applicationData = await collection.findOne({ prnNo: id });
    client.close();

    if (!applicationData) {
      return { notFound: true };
    }

    return {
      props: {
        applicationData: JSON.parse(JSON.stringify(applicationData)),
      },
    };
  } catch (error) {
    client.close();
    return { props: { error: 'Failed to fetch application data.' } };
  }
}

export default ApplicationDetails;

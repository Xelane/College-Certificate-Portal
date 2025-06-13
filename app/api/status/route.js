// app/api/status/route.js
import dbConnect from '../dbConnect';
import FormData from '../../../models/FormData';

export const PATCH = async (req, res) => {
  await dbConnect();
  const { prnNo } = req.query;
  const { status } = req.body;

  try {
    const application = await FormData.findOne({ prnNo });
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    application.applicationStatus = status;
    await application.save();
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
};

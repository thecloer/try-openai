// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ImageAPIResponse } from '../../types/api.types';
import openai from '../../lib/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse<ImageAPIResponse>) {
  console.log('req.body', req.body);

  const { prompt, imageSize } = req.body;
  const size = imageSize === ' small' ? '256x256' : imageSize === 'medium' ? '512x512' : '1024x1024';

  try {
    const results = await openai.createImage({
      prompt,
      n: 3, // number of images to generate
      size,
    });

    const imageUrls = results.data.data.map((d) => d.url ?? '');
    return res.status(200).json({ success: true, data: imageUrls });
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else console.log(error.message);

    return res.status(400).json({ success: false, error: 'The image could not be generated.' });
  }
}

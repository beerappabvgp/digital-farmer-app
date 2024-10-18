import axios from 'axios';

export const createProduct = async (data: {
  name: string;
  description: string;
  price: number;
  quantity: number;
}) => {
  try {
    const response = await axios.post('/api/product', data);
    return response.data;
  } catch (error) {
    throw new Error('Error creating product');
  }
};

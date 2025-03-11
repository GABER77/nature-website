import axios from 'axios';
import { showAlert } from './alert';

// type is either 'data' or 'password
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'data'
        ? 'http://127.0.0.1:3000/api/v1/users/update-me'
        : 'http://127.0.0.1:3000/api/v1/users/update-password';

    const res = await axios.patch(url, data);

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

import axios from 'axios';

export const createData = async (newData) => {
    try {
        const url = 'https://task-backend-production-d106.up.railway.app/api/auth/signup';
        const response = await axios.post(url, newData);
        return response.data;
    } catch (error) {
        console.error('API Error:', error);
        throw new Error('Error creating data: ' + error.message);
    };
};

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`https://task-backend-production-d106.up.railway.app/api/auth/login`, {
            email,
            password,
        })
        return response.data;

    } catch (error) {
        console.log('api Error', error);
        if (error.response) {
            console.error('Server Response:', error.response.data);
            throw error.response.data
        };
    };
};

export const verifyOtpUser = async (token, otp) => {
    try {
        const response = await axios.post(
            'https://task-backend-production-d106.up.railway.app/api/auth/verify-otp',
            { otp },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        );
        return response.data;

    } catch (error) {
        if (error.response) {
            console.error('Server Response:', error.response.data);
            throw error.response.data
        } else if (error.request) {
            console.error('No response received:', error.request);
            throw new Error('No response from server. Please try again.');
        } else {
            console.error('Error setting up request:', error.message);
            throw new Error('Error verifying OTP: ' + error.message);
        };
    };
};

export const resendOtpUser = async (token) => {
    try {
        const response = await axios.get('https://task-backend-production-d106.up.railway.app/api/auth/resend-otp',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            },
        );
        return response.data;

    } catch (error) {
        console.log(error, 'error....');
        throw new Error('Error resend OTP: ' + error.message);
    };
};

// task apis 

export const createTask = async (token, newData) => {
    try {
        const response = await axios.post('https://task-backend-production-d106.up.railway.app/api/tasks', newData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            },
        );
        console.log(response.data, 'data......');
        return response.data;

    } catch (error) {
        console.log(error, 'error');
        if (error.response) {
            console.error('Server Response:', error.response.data);
            throw error.response.data
        }
        throw new Error('Error createta task: ' + error.message)
    };
};

export const retrieveTask = async (token) => {
    try {
        const response = await axios.get('https://task-backend-production-d106.up.railway.app/api/tasks',
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            },
        );
        return response.data;
    } catch (error) {
        console.log(error, 'error');
        if (error.response) {
            console.error('Server Response:', error.response.data);
            throw error.response.data
        }
        throw new Error('Error retrieve task: ' + error.message);
    };
};

export const retrieveStatus = async (token, status) => {
    try {
        const response = await axios.get(`https://task-backend-production-d106.up.railway.app/api/tasks?status=${status}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return response.data;

    } catch (error) {
        console.log(error, 'error');
        if (error.response) {
            console.error('Server Response:', error.response.data);
            throw error.response.data
        }
        throw new Error('Error retrieve status: ' + error.message);
    };
};

export const updateTask = async (token, id, data) => {
    try {
        const response = await axios.put(`https://task-backend-production-d106.up.railway.app/api/tasks/${id}`, data,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            },
        );
        return response.data;
    } catch (error) {
        console.log(error, 'error');
        if (error.response) {
            console.error('Server Response:', error.response.data);
            throw error.response.data
        }
        throw new Error('Error update task: ' + error.message);
    };
};

export const deleteTask = async (token, id) => {
    try {
        const response = await axios.delete(`https://task-backend-production-d106.up.railway.app/api/tasks/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            },
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Server Response:', error.response.data);
            throw error.response.data
        }
        throw new Error('Error delete task: ' + error.message);
    };
};

export const changeStatus = async (id, newStatus, token) => {
    try {
        const response = await axios.patch(`https://task-backend-production-d106.up.railway.app/api/tasks/${id}/status`,
            { status: newStatus },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            },
        );

        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Server Response:', error.response.data);
            throw error.response.data
        }
        throw new Error('Error change status: ' + error.message);
    };
};

export const statusList = async (status, token) => {
    try {
        const response = await axios.get(`https://task-backend-production-d106.up.railway.app/api/tasks?status=${status}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            },
        );
        console.log(response.data, 'data........');
        return response.data;

    } catch (error) {
        if (error.response) {
            console.error('Server Response:', error.response.data);
            throw error.response.data
        }
        throw new Error('Error statusList: ' + error.message);
    };
};

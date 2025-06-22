import React, { useState } from 'react';
import RepresentativeNavbar from "./RepresentativeNavbar";
import {
    Container,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Box,
    Button,
    Alert
} from '@mui/material';
import {
    createUser,
    changePassword,
    getUserByAcademicId,
    getUserByUsername
} from '../../services/UserService';

const userTypes = [
    { label: 'Student', value: 'student' },
    { label: 'Instructor', value: 'instructor' },
    { label: 'Institution Representative', value: 'institution_representative' }
];

export default function RepresentativePage() {
    const [type, setType] = useState('institution_representative');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [academicId, setAcademicId] = useState('');
    const [message, setMessage] = useState(null);
    const [severity, setSeverity] = useState('info');

    const isStudent = type === 'student';

    const handleAddUser = async () => {
        try {
            const payload = {
                email,
                password,
                role: type,
                name
            };

            if (isStudent) {
                payload.academicId = academicId;
            } else {
                payload.username = username;
            }

            const res = await createUser(payload);
            setSeverity('success');
            setMessage(`User created! ID: ${res.data.id || academicId}`);
            setEmail('');
            setUsername('');
            setName('');
            setPassword('');
            setAcademicId('');
        } catch (err) {
            console.error(err);
            setSeverity('error');
            setMessage(err.response?.data?.error || 'Failed to create user');
        }
    };

    const handleChangePassword = async () => {
        let userId = null;

        try {
            if (isStudent) {
                if (!academicId) {
                    setSeverity('warning');
                    setMessage('Please enter the Academic ID.');
                    return;
                }
                const res = await getUserByAcademicId(academicId);
                userId = res.data.id;
            } else {
                if (!username) {
                    setSeverity('warning');
                    setMessage('Please enter the Username.');
                    return;
                }
                const res = await getUserByUsername(username);
                userId = res.data.id;
            }

            await changePassword(userId, { newPassword: password });
            setSeverity('success');
            setMessage(`Password updated for user with ID ${userId}.`);
            setPassword('');
        } catch (err) {
            console.error(err);
            setSeverity('error');
            setMessage(err.response?.data?.error || 'Password change failed');
        }
    };

    return (
        <div>
            <RepresentativeNavbar />
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Card elevation={3}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>User Management</Typography>

                        <Box component="form" noValidate autoComplete="off" sx={{ display: 'grid', gap: 2, mb: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>User Type</InputLabel>
                                <Select
                                    value={type}
                                    label="User Type"
                                    onChange={e => setType(e.target.value)}
                                >
                                    {userTypes.map(u => (
                                        <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="e.g. jdoe@example.com"
                                fullWidth
                            />

                            {!isStudent && (
                                <TextField
                                    label="Username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="e.g. jdoe123"
                                    fullWidth
                                />
                            )}

                            <TextField
                                label="Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. John Doe"
                                fullWidth
                            />

                            <TextField
                                label="Password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                fullWidth
                            />

                            {isStudent && (
                                <TextField
                                    label="Academic ID"
                                    value={academicId}
                                    onChange={e => setAcademicId(e.target.value)}
                                    placeholder="e.g. 03181110"
                                    fullWidth
                                />
                            )}

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button variant="contained" color="primary" onClick={handleAddUser}>
                                    Add User
                                </Button>
                                <Button variant="outlined" color="secondary" onClick={handleChangePassword}>
                                    Change Password
                                </Button>
                            </Box>
                        </Box>

                        {message && (
                            <Alert severity={severity} onClose={() => setMessage(null)}>
                                {message}
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </div>
    );
}




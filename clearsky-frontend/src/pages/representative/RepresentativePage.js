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
import { createUser, changePassword, getUserByAcademicId } from '../../services/UserService';

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

    const handleAddUser = async () => {
        try {
            const payload = {
                email,
                password,
                role: type,
                name
            };

            if (type !== 'student') {
                payload.username = username;
            } else {
                payload.academicId = academicId;
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
        if (!academicId && type === 'student') {
            setSeverity('warning');
            setMessage('Please enter the Academic ID to change the student password.');
            return;
        }

        try {
            const res = await getUserByAcademicId(academicId);
            const userId = res.data.id;

            await changePassword(userId, { newPassword: password });
            setSeverity('success');
            setMessage(`Password updated for user with ID ${academicId}.`);
            setPassword('');
        } catch (err) {
            console.error(err);
            setSeverity('error');
            setMessage(err.response?.data?.error || 'Password change failed');
        }
    };

    const isStudent = type === 'student';

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

                            {/* Email */}
                            <TextField
                                label="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="e.g. jdoe@example.com"
                                fullWidth
                            />

                            {/* Username (not for student) */}
                            {!isStudent && (
                                <TextField
                                    label="Username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="e.g. jdoe123"
                                    fullWidth
                                />
                            )}

                            {/* Name (everyone) */}
                            <TextField
                                label="Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g. John Doe"
                                fullWidth
                            />

                            {/* Password */}
                            <TextField
                                label="Password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                fullWidth
                            />

                            {/* Academic ID (only for student) */}
                            {isStudent && (
                                <TextField
                                    label="Academic ID"
                                    value={academicId}
                                    onChange={e => setAcademicId(e.target.value)}
                                    placeholder="e.g. 03181110"
                                    fullWidth
                                />
                            )}

                            {/* Buttons */}
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button variant="contained" color="primary" onClick={handleAddUser}>
                                    Add User
                                </Button>
                                {isStudent && (
                                    <Button variant="outlined" color="secondary" onClick={handleChangePassword}>
                                        Change Password
                                    </Button>
                                )}
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

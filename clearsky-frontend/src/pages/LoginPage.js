import React, { useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    InputAdornment,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Link
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Person as PersonIcon,
    Lock as LockIcon
} from '@mui/icons-material';
import {login} from "../services/AuthService"; // Import του userApi

export default function LoginPage({ onLogin }) { // Λαμβάνουμε την onLogin prop
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const requestBody = {
                identifier, // this can be email, academicId, or username
                password
            };
            const response = await login(requestBody);
            const { accessToken, refreshToken } = response.data;
            onLogin(accessToken, refreshToken); // App.js will handle redirect

        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid
            container
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, rgba(0,123,255,0.15), rgba(0,123,255,0.30))',
                color: 'common.white',
            }}
        >
            {/* Left side */}
            <Grid
                item xs={12} md={6}
                sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
                    Welcome to <Box component="span" color="primary.main">clearSKY</Box>
                </Typography>
                <Typography variant="subtitle1" gutterBottom sx={{ color: 'rgba(0,123,255,0.8)' }}>
                    Your academic performance tracking system
                </Typography>
                <List>
                    {[
                        'Track your academic performance in real-time',
                        'Visualize progress with intuitive charts',
                        'Get personalized insights to improve performance'
                    ].map(text => (
                        <ListItem key={text}>
                            <ListItemIcon sx={{ color: 'primary.main' }}>
                                <CheckCircleIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={text}
                                primaryTypographyProps={{ color: 'primary.main' }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Grid>

            {/* Right side */}
            <Grid
                item xs={12} md={6}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { xs: 'center', md: 'flex-end' },
                    p: 4
                }}
            >
                <Paper elevation={8} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
                    <Typography variant="h4" color="primary" gutterBottom>
                        clearSKY
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Academic Performance Dashboard
                    </Typography>

                    {/* 3️⃣ attach handleSubmit here */}
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
                        {error && (
                            <Typography color="error" sx={{ mb: 1 }}>
                                {error}
                            </Typography>
                        )}
                        <TextField
                            fullWidth
                            label="Username/Email"
                            margin="normal"
                            value={identifier}
                            onChange={e => setIdentifier(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="action" />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <TextField
                            fullWidth
                            type="password"
                            label="Password"
                            margin="normal"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Typography variant="subtitle2" sx={{ mt: 2 }}>
                            I am a:
                        </Typography>
                        <RadioGroup
                            row
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            sx={{ mb: 2 }}
                        >
                            <FormControlLabel value="student" control={<Radio />} label="Student" />
                            <FormControlLabel value="instructor" control={<Radio />} label="Instructor" />
                            <FormControlLabel value="institution_representative" control={<Radio />} label="Institution Representative" />

                        </RadioGroup>

                        {/* 4️⃣ make this button submit the form */}
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>

                        <Box textAlign="center" sx={{ mt: 1 }}>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
}
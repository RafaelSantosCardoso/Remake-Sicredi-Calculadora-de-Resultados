import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import {
    Grid,
    Hidden,
    makeStyles,
    Typography,
    useMediaQuery,
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import jwt from "jsonwebtoken";

import { openSnackbar } from "../../actions/snackbarActions.js";
import { ReactComponent as InIcon } from "../../assets/In.svg";
import { ReactComponent as LockIcon } from "../../assets/Lock.svg";
import { ReactComponent as Logo } from "../../assets/LogoSicrediLogin.svg";
import Button from "../../components/Button";
import Container from "../../components/Container";
import Input from "../../components/Input";
import Link from "../../components/Link";
import api from "../../services/api.js";
import theme from "../../styles/customMuiTheme.js";
import homeRoute from "../../utils/homeRoute.js";
import LogoutButton from "../../components/LogoutButton"

const useStyles = makeStyles({
    container: {
        flex: 1,
        height: "100vh",
    },
    text: {
        fontSize: 36,
        color: theme.palette.primary.main,
    },
});

function LoginPage() {
    const classes = useStyles();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const history = useHistory();
    const dispatch = useDispatch();

    async function login(values) {
        try {
            const user = await api.post("/login", {
                document: values.cpf,
                password: values.password,
            });
            const token = user.headers.authorization;
            window.localStorage.setItem("token", token.split(" ")[1]);

            const decodedToken = jwt.decode(token.split(" ")[1]);

            history.push(homeRoute(decodedToken.role));
        } catch (e) {
            dispatch(
                openSnackbar({
                    message: "Usuário ou senha incorreto!",
                    severity: "error",
                })
            );
        }
    }

    return (
        <Container maxWidth="lg">
            <Formik
                initialValues={{ cpf: "", password: "" }}
                onSubmit={async (values) => {
                    await login(values);
                }}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form>
                        <Grid
                            container
                            className={classes.container}
                            justify="center"
                            alignItems="center"
                        >
                            <Hidden smUp>
                                <Grid
                                    item
                                    xs={12}
                                    md={8}
                                    container
                                    justify="center"
                                >
                                    <Logo
                                        width={isMobile ? 312 : 523}
                                        height={isMobile ? 78 : 130}
                                    />
                                </Grid>
                            </Hidden>
                            <Grid item xs={12} md={4} container spacing={4}>
                                <Grid item xs={12}>
                                    <Typography className={classes.text}>
                                        Faça seu login
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        name="cpf"
                                        as={Input}
                                        label="CPF ou Código da Cooperativa"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        name="password"
                                        as={Input}
                                        label="Senha"
                                        type="password"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        fullWidth
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        Entrar
                                    </Button>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    container
                                    alignItems="center"
                                    spacing={2}
                                >
                                    <Grid item>
                                        <LockIcon width={24} height={24} />
                                    </Grid>
                                    <Grid item>
                                        <Link to="/forgot-password">
                                            Esqueci minha senha
                                        </Link>
                                    </Grid>
                                </Grid>
                                <Grid
                                    item
                                    xs={12}
                                    container
                                    alignItems="center"
                                    spacing={2}
                                >
                                    <Grid item>
                                        <InIcon width={24} height={24} />
                                    </Grid>
                                    <Grid item>
                                        <Link to="/register">
                                            Não tenho cadastro
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Hidden smDown>
                                <Grid
                                    item
                                    xs={12}
                                    md={8}
                                    container
                                    justify="center"
                                >
                                    <Logo
                                        width={isMobile ? 312 : 523}
                                        height={isMobile ? 78 : 130}
                                    />
                                </Grid>
                            </Hidden>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Container>
    );
}

export default LoginPage;

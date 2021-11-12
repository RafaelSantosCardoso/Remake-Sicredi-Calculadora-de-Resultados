import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { Grid, useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import {
    calculate,
    removeProduct,
    updateProduct,
} from "../../actions/selectedProductsActions.js";
import { ReactComponent as Logo } from "../../assets/Logo.svg";
import AutoComplete from "../../components/AutoComplete";
import Button from "../../components/Button";
import Container from "../../components/Container";
import LogoutMenu from "../../components/LogoutMenu";
import Table from "../../components/Table";
import theme from "../../styles/customMuiTheme.js";
import LogoutButton from "../../components/LogoutButton"
import ButtonSicredi from "../../components/ButtonSicredi"


const useStyles = makeStyles({
    logo: {
        position: "fixed",
        top: 5,
        right: 5,
    },
});

const columns = [
    { title: "Nome", field: "name", editable: "never" },
    { title: "Valor", field: "value", editable: "onUpdate" },
    { title: "Peso", field: "weight", editable: "never" },
    { title: "Categoria", field: "categoryName", editable: "never" },
];

export function ProductsUserPage() {
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const classes = useStyles();
    const history = useHistory();

    let oldSelectedProducts = useSelector(
        (state) => state.selectedProducts.data.products
    );

    const selectedProducts = oldSelectedProducts.map((item) => {
        item.weight = item.weight + "";
        if (item.weight.slice(-1) !== "%")
            return {
                ...item,
                weight: item.weight + "%",
            };
        return { ...item };
    });

    const dispatch = useDispatch();

    const handleDelete = (oldData) => {
        return new Promise((resolve) => {
            dispatch(removeProduct(oldData));
            resolve();
        });
    };

    const handleUpdate = (oldData, newData) => {
        return new Promise((resolve) => {
            if (oldData) {
                dispatch(updateProduct(newData, oldData));
            }
            resolve();
        });
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOnClick = () => {
        localStorage.clear();
        history.push("/");
        setAnchorEl(null);
    };

    return (
        <>
            <Grid container
                  direction="row"
                  justifyContent="center"
                  alignItems="flex-start"
                  spacing={2}
            >
                <Grid item>
                    <LogoutButton  onClick={() => {
                        window.localStorage.removeItem("token")
                        history.push("/login") }}> </LogoutButton>
                </Grid>
                <Grid item>
                    <ButtonSicredi href={'https://www.sicredi.com.br/site/home'}/>
                </Grid>
            </Grid>

            <Logo
                aria-controls="menu"
                aria-haspopup="true"
                className={classes.logo}
                width={isMobile ? 32 : 64}
                height={isMobile ? 32 : 64}
                style={{ cursor: "pointer" }}
            />
            <LogoutMenu
                id="menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                keepMounted
                onClose={handleClose}
                onClick={handleOnClick}
            />

            <Container style={{ padding: isMobile ? 30 : 40 }}>

                <Grid
                    spacing={isMobile ? 6 : 8}
                    container
                    justify="flex-start"
                    alignItems="center"
                >
                    <Grid item xs={12} container justify="center">
                        <Container maxWidth="xs">
                            <AutoComplete fullWidth />
                        </Container>
                    </Grid>
                    <Grid item xs={12} container justify="center">
                        <Table
                            columns={columns}
                            data={selectedProducts}
                            title="Produtos"
                            style={isMobile ? { width: 310 } : {}}
                            delete={handleDelete}
                            update={handleUpdate}
                        />
                    </Grid>
                    <Grid item xs={12} container justify="center">
                        <Container maxWidth="xs">
                            <Button
                                fullWidth
                                color="dark"
                                onClick={() =>
                                    dispatch(calculate(selectedProducts))
                                }
                            >
                                Calcular
                            </Button>
                        </Container>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

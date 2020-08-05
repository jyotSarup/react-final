import React, { useState } from "react";
import { Card, List } from "antd";

import { EditOutlined } from "@ant-design/icons";
import UpdateArtist from "../forms/UpdateArtist";
import RemoveArtist from "../buttons/RemoveArtist";
import Instrument from "./Instrument";
import { useQuery } from "@apollo/react-hooks";
import { GET_INSTRUMENTS } from "../../queries";

const getStyles = () => ({
    card: {
        width: "500px",
    },
    list: {
        display: "flex",
        justifyContent: "center",
    },
});



const Artist = (props) => {
    const [id] = useState(props.id);
    const [firstName, setFirstName] = useState(props.firstName);
    const [lastName, setLastName] = useState(props.lastName);
    const [editMode, setEditMode] = useState(false);
    const styles = getStyles();

    const fullName = () => {
        return `${props.firstName} ${props.lastName}`;
    };

    const updateStateVariable = (variable, value) => {
        switch (variable) {
            case "firstName":
                setFirstName(value);
                break;
            case "lastName":
                setLastName(value);
                break;
            default:
                break;
        }
    };

    const handleButtonClick = () => setEditMode(!editMode);
    
    const { loading, error, data } = useQuery(GET_INSTRUMENTS);
  if (loading) return "Loading...";
if (error) return `Errror! ${error.message}`;
    return (
        <List.Item key={props.id} style={{margin:"16px", border:"1px black solid"}}>
            {editMode ? (
                <UpdateArtist
                    id={id}
                    firstName={firstName}
                    lastName={lastName}
                    onButtonClick={handleButtonClick}
                    updateStateVariable={updateStateVariable}
                />
            ) : (
                <Card
                    actions={[
                        <EditOutlined key="edit" onClick={handleButtonClick} />,
                        <RemoveArtist
                            id={id}
                            firstName={firstName}
                            lastName={lastName}
                        />,
                    ]}
                    style={styles.card}
                >
                    {fullName()}
                </Card>
            )}

            <List grid={{ gutter: 20, column: 1 }} style={styles.list}>
                {data.instruments.map(({ id,year, brand, type, price, artistId}) => (

                (props.id === artistId) ?
                    <List.Item key={id}>
                        <Instrument
                            
                            key={id}
                            id={id} year={year}  brand={brand} type={type} price={price} artistId={artistId}
                        />
                    </List.Item> : <span></span>
                ))}
            </List>
        </List.Item>
    );
};

export default Artist;

import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";

import { Form, Input, Button, InputNumber, Select } from "antd";

import { v4 as uuidv4 } from "uuid";

import { ADD_INSTRUMENT, GET_INSTRUMENTS, GET_ARTISTS } from "../../queries";

const { Option } = Select;

const AddInstrument = () => {
    const [id] = useState(uuidv4());

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
    };

    const [addInstrument] = useMutation(ADD_INSTRUMENT, {
        update(cache, { data: { addInstrument } }) {
            const { instruments } = cache.readQuery({ query: GET_INSTRUMENTS });
            cache.writeQuery({
                query: GET_INSTRUMENTS,
                data: { instruments: instruments.concat([addInstrument]) },
            });
        },
    });

    const [form] = Form.useForm();
    const [, forceUpdate] = useState();

    // To disable submit button at the beginning.
    useEffect(() => {
        forceUpdate({});
    }, []);

    const onFinish = (values) => {
        console.log(values);
        console.log(id);
        const { year, brand, type, price, artistId } = values;
        let yearString = year.toString();
        let priceString = price.toString();
        console.log(yearString,priceString)
        addInstrument({
            variables: {
                id,
                year: yearString,
                brand,
                type,
                price:priceString,
                artistId,
            },
            optimisticResponse: {
                __typename: "Mutation",
                addInstrument: {
                    __typename: "Instrument",
                    id,
                    yearString,
                    brand,
                    type,
                    priceString,
                    artistId,
                },
            },

            update: (proxy, { data: { addInstrument } }) => {
                const data = proxy.readQuery({ query: GET_INSTRUMENTS });
                proxy.writeQuery({
                    query: GET_INSTRUMENTS,
                    data: {
                        ...data,
                        instruments: [...data.instruments, addInstrument],
                    },
                });
            },
        });
    };

    const { loading, error, data } = useQuery(GET_ARTISTS);
    if (loading) return "Loading...";
    if (error) return `Error! ${error.message}`;
    return (
        <div
            style={{ border: "1px solid black", width: "80%", padding: "2em" }}
        >
            <h1>Add Instrument</h1>
            <Form
                {...layout}
                form={form}
                name="add-instrument-form"
                onFinish={onFinish}
                size="large"
                style={{ marginBottom: "40px" }}
            >
                <Form.Item
                    name="year"
                    label="Year"
                    rules={[
                        { required: true, message: "Please provide year!" },
                    ]}
                >
                    <InputNumber
                        placeholder="i.e. 2020"
                        style={{ margin: "auto" }}
                    />
                </Form.Item>

                <Form.Item
                    name="brand"
                    label="Brand"
                    rules={[
                        {
                            required: true,
                            message: "Please provide brand of instrument!",
                        },
                    ]}
                >
                    <Input placeholder="i.e. Yamaha" />
                </Form.Item>

                <Form.Item
                    name="type"
                    label="Type"
                    rules={[
                        {
                            required: true,
                            message: "Please provide type of instrument!",
                        },
                    ]}
                >
                    <Input placeholder="i.e. Electric Guitar" />
                </Form.Item>

                <Form.Item
                    name="price"
                    label="Price"
                    rules={[
                        {
                            required: true,
                            message: "Please provide price of instrument!",
                        },
                    ]}
                >
                    <InputNumber
                        formatter={(value) =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    />
                </Form.Item>

                <Form.Item
                    name="artistId"
                    label="Artist"
                    rules={[{ required: true }]}
                >
                    <Select defaultValue="1">
                        {data.artists.map(({ id, firstName, lastName }) => (
                            <option value={id}>
                                {firstName} {lastName}
                            </option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item shouldUpdate={true}>
                    {() => (
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={
                                !form.isFieldsTouched(true) ||
                                form
                                    .getFieldsError()
                                    .filter(({ errors }) => errors.length)
                                    .length
                            }
                        >
                            Add Instrument
                        </Button>
                    )}
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddInstrument;

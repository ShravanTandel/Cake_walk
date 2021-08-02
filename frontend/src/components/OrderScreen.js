import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./LoaderAndError/Loader";
import Message from "./LoaderAndError/Message";
import { getOrderDetails } from "../actions/orderActions";
import ErrorIcon from "@material-ui/icons/Error";





import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Footer from "./Footer";


function OrderScreen({ match, history }) {

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    }));

    const classes = useStyles();

    const steps = [
    "Order Placed",
    "Order confirmed",
    "Order preparing",
    "Out for delivery",
    "Order deliveried",
    ];
    
    const mark = {
    "Yet to confirm": 0,
    "Order confirmed": 1,
    "Order preparing": 2,
    "Out for delivery": 3,
    "Order deliveried": 5,
    };
  const orderId = match.params.id;
  const dispatch = useDispatch();

  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const padding = {
    paddingLeft: "20px",
  };

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : error ? (
    <Message messagetype="danger">
      <ErrorIcon />
      {error}
    </Message>
  ) : (
    <>
      <div className="row">
        <div className="col-10 mx-auto">
          <Row>
            <h1>Order: {order.id}</h1>
            <br />
            <br />
            <br />
            <Col md={6}>
                <Card>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h2>Shipping</h2>
                  <p>
                    <strong>Name: </strong> {order.user.name}
                  </p>
                  <p>
                    <strong>Email: </strong>
                    <a href={`mailto:${order.user.email}`}>
                      {order.user.email}
                    </a>
                  </p>
                  <p>
                    <strong>Shipping: </strong>
                    {order.address},
                  </p>
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Order Items</h2>
                  {order.orderItems.length === 0 ? (
                    <Message messagetype="info">Order is empty</Message>
                  ) : (
                    <ListGroup variant="flush">
                      {order.orderItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row>
                            <Col md={2}>
                              <Image
                                src={item.image}
                                alt={item.productname}
                                fluid
                                rounded
                              />
                            </Col>

                            <Col md={4} style={padding}>
                              {item.productname}
                            </Col>

                            <Col md={4}>
                              price: {item.quantity}x
                              {item.price / item.quantity} = {item.price}
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </ListGroup.Item>
              </ListGroup>
              </Card>
            </Col>
            <Col md={6} l>
                <div className= "d-flex justify-content-center mt-4 mb-4">
                    <h1>Update</h1>
                </div>

                <div className="d-flex justify-content-center">
                <Stepper
                  activeStep={mark[order.deliveryStatus]}
                  orientation="vertical"
                >
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default OrderScreen;
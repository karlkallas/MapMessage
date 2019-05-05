import React from 'react';
import { ReactComponent as Loading } from './media/loading.svg';
import { Card, Button, CardTitle, CardText, Form, FormGroup, Label, Input } from 'reactstrap';

export default (props) => {
    return (
        <Card body className="message-form">
          <CardTitle>Hello !</CardTitle>
          <CardText>Leave a message with your location.. </CardText>
          {
            !props.sendingMessage &&
            !props.sentMessage &&
            props.haveUsersLocation ?

            <Form onSubmit={props.formSubmitted}>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  onChange={props.valueChanged}
                  type="text" 
                  name="name" 
                  id="name" 
                  placeholder="Enter your name" />
              </FormGroup>
              <FormGroup>
                <Label for="message">Message</Label>
                <Input
                  onChange={props.valueChanged}
                  type="textarea" 
                  name="message" 
                  id="message" 
                  placeholder="Enter message" />
              </FormGroup>
              <Button type="submit" disabled={!props.formIsValid()}>Post</Button>
            </Form> : 
            props.sendingMessage || !props.haveUsersLocation ?
            <Loading className="loading_svg"/> : 
            <CardText>Thanks for leaving a message!</CardText>
          }
        </Card>
    );
};
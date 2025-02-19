// 观察者模式 - 观察者订阅消息，被观察者发布消息

import { Button, Col, Row, message } from "antd";

// 观察者 - 主动订阅
class Observer {
  constructor(name, callback) {
    this.name = name;
    this.callback = callback;
  }

  subscribe(publisher) {
    publisher.addObserver(this);
  }

  notify(message) {
    this.callback(message);
  }
}

// 被观察者 - 发布消息
class Publisher {
  constructor() {
    this.observerList = [];
  }

  addObserver(observer) {
    this.observerList.push(observer);
  }

  publish(message) {
    this.observerList.forEach((o) => o.notify(message));
  }

  removeObserver(name) {
    this.observerList = this.observerList.filter((o) => o.name !== name);
  }
}

const ObjectMode = () => {
  const observer_1 = new Observer("lee", (m) => {
    message.success("lee get the " + m);
  });

  const observer_2 = new Observer("jack", (m) => {
    message.success("jack get the " + m);
  });

  const publisher = new Publisher();

  observer_1.subscribe(publisher);
  observer_2.subscribe(publisher);

  const sendMessage = () => {
    publisher.publish("love");
  };

  return (
    <Row>
      <Col span={2}>
        <Button type="primary" onClick={sendMessage}>
          publish
        </Button>
      </Col>

      <Col>
        <Button
          onClick={() => {
            publisher.removeObserver("lee");
          }}
        >
          remove obsever_1
        </Button>
      </Col>
    </Row>
  );
};

export default ObjectMode;

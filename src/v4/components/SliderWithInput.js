import { Col, InputNumber, Row, Slider } from "antd";

const SliderWithInput = (props) => {

  const { min, max, step, value, onChange, style } = props;


  return (
    <Row style={style}>
      {/* <Col span={1}>
        {text}
      </Col> */}
      <Col span={12}>
        <Slider
          min={min}
          max={max}
          onChange={onChange}
          value={typeof value === 'number' ? value : 0}
          step={step}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={min}
          max={max}
          style={{ margin: '0 16px' }}
          step={step}
          value={value}
          onChange={onChange}

        />
      </Col>
    </Row>
  );
};

export default SliderWithInput;
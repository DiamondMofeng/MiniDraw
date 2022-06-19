import { InputNumber, Slider, Switch } from "antd";
import { useEffect, useState, useRef } from "react";
import { Matrix3 } from "three";
import { setColor } from "../../learnWebGL/utils/glUtils";
import { doOffset, transformFigure2D } from "../../learnWebGL/utils/utils";
import { Line } from "../class/DrawObj";
import SliderWithInput from "./SliderWithInput";


/**
 * @component Transform - 用于对firgure进行变换
 */
const TransformBox = ({ pen, figure, index }) => {

  index = figure.index || index;



  const [onTransform, setOnTransform] = useState(false);

  const [m3, setM3] = useState(new Matrix3());
  const [m3_preview, setM3_preview] = useState(new Matrix3());

  const transformRef = useRef(null);


  // const [previewFigure, setPreviewFigure] = useState(null);

  const [showBasePoint, setShowBasePoint] = useState(false);

  const preview = (m) => {
    if (!onTransform) {
      return;
    }

    let f = transformFigure2D(figure.clone(), m)

    setColor(pen.gl, 'u_FragColor', new Float32Array([0.0, 0.0, 0.0, 1.0]));
    pen.renderAll();

    setColor(pen.gl, 'u_FragColor', new Float32Array([1.0, 0.0, 0.0, 1.0]));
    f.draw(pen.gl, 'a_Position');

    //绘制原点
    
    if (showBasePoint) {
      new Line(baseX - 0.05, baseY, baseX + 0.05, baseY).draw(pen.gl, 'a_Position');
      new Line(baseX, baseY - 0.05, baseX, baseY + 0.05).draw(pen.gl, 'a_Position');
    }
    
    setColor(pen.gl, 'u_FragColor', new Float32Array([0.0, 0.0, 0.0, 1.0]));
  }





  useEffect(() => {
    const transformComponent = transformRef.current;
    if (!transformComponent) {
      return;
    }
    transformComponent.addEventListener('onmouseover', (e) => {
      preview(m3_preview);
    });

  })


  useEffect(() => {
    if (!onTransform) {
      return;
    }
    preview(m3_preview);

  })


  // 基于这个点进行变换
  const [baseX, setBaseX] = useState(0);
  const [baseY, setBaseY] = useState(0);

  //平移变换
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const handleOffset = (x, y) => {
    const m_offset = new Matrix3();
    const _m3 = m3.clone()
    m_offset.set(
      1, 0, 0,
      0, 1, 0,
      x, y, 1);
    setM3(_m3.multiply(m_offset));
    setOffsetX(0);
    setOffsetY(0);
  }

  //旋转变换
  //默认顺时针
  const [clockwise, setClockwise] = useState(false);
  const [angle, setAngle] = useState(0);    //角度
  const handleRotate = (clockwise, angle) => {
    /**
     * 公式：
     * 逆时针：
     * cos(angle)   sin(angle)  0
     * -sin(angle)  cos(angle)  0
     * 0            0           1 
     */
    const m_rotate = new Matrix3();
    const _m3 = m3.clone()
    doOffset(_m3, -baseX, -baseY);

    if (clockwise) {
      angle = 360 - angle;
    }

    const theta = angle * Math.PI / 180;

    m_rotate.set(
      Math.cos(theta), Math.sin(theta), 0,
      -Math.sin(theta), Math.cos(theta), 0,
      0, 0, 1);
    setM3(_m3.multiply(m_rotate));
    setAngle(0);

    doOffset(_m3, baseX, baseY);

  }

  //缩放变换
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const handleScale = (scaleX, scaleY) => {

    const _m3 = m3.clone()
    doOffset(_m3, -baseX, -baseY);

    const m_scale = new Matrix3();
    m_scale.set(scaleX, 0, 0, 0, scaleY, 0, 0, 0, 1);
    setM3(_m3.multiply(m_scale));
    setScaleX(1);
    setScaleY(1);

    doOffset(_m3, baseX, baseY);

  }

  //自定义变换
  const [customMatrix, setCustomMatrix] = useState(
    [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ]);

  const handleCustomTransform = (customMatrix) => {
    const m_custom = new Matrix3();
    const _m3 = m3.clone();
    doOffset(_m3, -baseX, -baseY);

    m_custom.set(...customMatrix);
    // m_custom.transpose();
    setM3(_m3.multiply(m_custom));
    setCustomMatrix([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ]);

    doOffset(_m3, baseX, baseY);

  }



  //重置变换矩阵

  const reset = () => {
    setM3(new Matrix3());
    setM3_preview(new Matrix3());

    setBaseX(0);
    setBaseY(0);

    setOffsetX(0);
    setOffsetY(0);
    setAngle(0);
    setScaleX(1);
    setScaleY(1);
    setCustomMatrix([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ]);
  }

  const handleReset = () => {
    reset();
  }


  //最终应用变换
  const handleApplyTransform = (index) => {
    pen.applyTransformAt(index, m3);

    setOnTransform(!onTransform);

    reset();

  }



  // for (let fun of [setOffsetX, setOffsetY]) {
  //   fun = (...args) => {
  //     fun(...args);
  //     let _m3=m3.clone();
  //     _m3.setUvTransform(offsetX, offsetY);
  //   }
  // }

  // setAngle,
  // setClockwise
  // setScaleX,
  // setScaleY,
  // setCustomMatrix,



  /**
   * @component Transform - 可视化矩阵
   * @param {Matrix3} matrix 
   * @returns 
   */
  const Matrix3Visual = ({ matrix }) => {

    const _m = matrix.clone();
    _m.transpose();
    const eles = _m.elements;

    const rows = [
      [eles[0], eles[1], eles[2]],
      [eles[3], eles[4], eles[5]],
      [eles[6], eles[7], eles[8]]
    ]

    const style_table = {
      border: '1px solid #ccc',
      borderCollapse: 'collapse',
      width: '100%',
      textAlign: 'center',
      fontSize: '12px',
      fontFamily: 'Consolas, "Courier New", monospace',
      color: '#333',
      innerHeight: '100%',
    }
    // console.log('rows:', rows)
    return (

      <table border="1" style={style_table}>
        <tbody>
          {
            rows.map((row, ir) =>
              <tr key={ir}>
                {row.map((col, ic) =>
                  <td key={ir + ic}>{col.toFixed(4)}</td>
                )}
              </tr>
            )
          }
        </tbody>
      </table>

    )

  }


  //* 实现预览功能
  useEffect(() => {
    if (!onTransform) {
      return;
    }
    // console.log('do preview')
    const _m3 = m3.clone();
    doOffset(_m3, -baseX, -baseY);

    const _CM = new Matrix3()
    _CM.set(...customMatrix)


    //平移

    _m3.elements[2] += offsetX;
    _m3.elements[5] += offsetY;

    //旋转
    let m_rotate = new Matrix3();
    let _angle = angle
    if (clockwise) {
      _angle = 360 - angle;
    }
    let theta = _angle * Math.PI / 180;
    m_rotate.set(
      Math.cos(theta), Math.sin(theta), 0,
      -Math.sin(theta), Math.cos(theta), 0,
      0, 0, 1);
    _m3.multiply(m_rotate);

    //缩放
    let m_scale = new Matrix3();
    m_scale.set(scaleX, 0, 0, 0, scaleY, 0, 0, 0, 1);
    _m3.multiply(m_scale);

    _m3.multiply(_CM);

    doOffset(_m3, baseX, baseY);

    // preview(_m3);
    setM3_preview(_m3);
  }, [onTransform, m3, customMatrix, offsetX, offsetY, clockwise, angle, scaleX, scaleY, baseX, baseY])

  // useEffect(() => {

  //   setM3_preview(m3)
  // }, [m3])


  const style_transformBlock = {
    border: '1px solid #ccc',
    padding: '10px',
  }


  return (
    <div ref={transformRef}>

      <button onClick={() => setOnTransform(!onTransform)}>变换</button>
      {
        onTransform === false
          ? null
          : <>
            <p>说明:分别操作下方变换方法来修改总变换矩阵,最后应用变换矩阵得到结果.每单项变换完后需要确定！</p>
            <Matrix3Visual matrix={m3} />
            <button onClick={() => handleReset()}>重置</button>
            <button onClick={() => handleApplyTransform(index)}>应用变换</button>

            <div style={style_transformBlock}>
              <p>变换原点</p>
              <Switch checkedChildren="显示" unCheckedChildren="隐藏"
                onChange={() => setShowBasePoint(!showBasePoint)} checked={showBasePoint} />
              <p />
              x<SliderWithInput min={-1} max={1} step={0.01} value={baseX} onChange={setBaseX}></SliderWithInput>
              y<SliderWithInput min={-1} max={1} step={0.01} value={baseY} onChange={setBaseY}></SliderWithInput>
            </div>


            <div style={style_transformBlock}>
              <p>平移变换</p>
              x<SliderWithInput min={-1} max={1} step={0.01} value={offsetX} onChange={setOffsetX} >x</SliderWithInput>
              y<SliderWithInput min={-1} max={1} step={0.01} value={offsetY} onChange={setOffsetY} >y</SliderWithInput>
              <button onClick={() => handleOffset(offsetX, offsetY)}>平移变换</button>
            </div>
            <div style={style_transformBlock}>
              <p>角度变换</p>
              <SliderWithInput min={-180} max={180} step={1} value={angle} onChange={setAngle} >旋转</SliderWithInput>
              <Switch checkedChildren="顺时针" unCheckedChildren="逆时针"
                onChange={() => setClockwise(!clockwise)} checked={clockwise} />
              <p />
              <button onClick={() => handleRotate(clockwise, angle)}>角度变换</button>
            </div>
            <div style={style_transformBlock}>
              <p>缩放变换</p>
              x<SliderWithInput min={0.1} max={2} step={0.01} value={scaleX} onChange={setScaleX} >x</SliderWithInput>
              y<SliderWithInput min={0.1} max={2} step={0.01} value={scaleY} onChange={setScaleY} >y</SliderWithInput>
              <button onClick={() => handleScale(scaleX, scaleY)}>缩放变换</button>
            </div>
            <div style={style_transformBlock}>
              <p>自定义变换</p>
              {/* <p>使用[ ]包裹，使用英文逗号","分割</p>
              <p>例：[1,0,0,0,1,0,0,0,1]</p> */}
              {
                customMatrix.map((item, index) =>
                  <InputNumber
                    style={{
                      width: '30%',
                      fontSize: '12px',
                    }}
                    key={index}
                    step={0.01}
                    value={item}
                    onChange={(v) => {
                      console.log('customMatrix:', customMatrix)
                      const _customMatrix = [...customMatrix];
                      _customMatrix[index] = v;
                      setCustomMatrix(_customMatrix);
                    }} />
                )
              }
              <button onClick={() => handleCustomTransform(customMatrix)}>自定义变换</button>


            </div>

            <p />



          </>
      }
    </div>
  )




}

export default TransformBox;
import { InputNumber, Slider, Switch } from "antd";
import { useEffect, useState } from "react";
import { Matrix3 } from "three";
import { setColor } from "../../learnWebGL/utils/glUtils";
import { transformFigure2D } from "../../learnWebGL/utils/utils";


/**
 * @component Transform - 用于对firgure进行变换
 */
const TransformBox = ({ pen, figure, index }) => {

  index = figure.index || index;



  const [onTransform, setOnTransform] = useState(false);

  const [m3, setM3] = useState(new Matrix3());

  useEffect(() => {
    if (!onTransform) {
      return;
    }
    let f = transformFigure2D(figure.clone(), m3)
    // console.log('f: ', f);
    // console.log(f, figure)
    // console.log(f === figure)

    setColor(pen.gl, 'u_FragColor', new Float32Array([0.0, 0.0, 0.0, 1.0]));
    pen.renderAll();

    setColor(pen.gl, 'u_FragColor', new Float32Array([1.0, 0.0, 0.0, 1.0]));
    f.draw(pen.gl, 'a_Position');

    setColor(pen.gl, 'u_FragColor', new Float32Array([0.0, 0.0, 0.0, 1.0]));

  }, [m3, figure, pen, onTransform])


  // 基于这个点进行变换
  // const [baseX, setbaseX] = useState(0);
  // const [baseY, setbaseY] = useState(0);

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

    if (clockwise) {
      angle = 360 - angle;
    }

    const theta = angle * Math.PI / 180;

    m_rotate.set(
      Math.cos(theta), Math.sin(theta), 0,
      -Math.sin(theta), Math.cos(theta), 0,
      0, 0, 1);
    setM3(_m3.multiply(m_rotate));

  }

  //缩放变换
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const handleScale = (scaleX, scaleY) => {
    const m_scale = new Matrix3();
    const _m3 = m3.clone()
    m_scale.set(scaleX, 0, 0, 0, scaleY, 0, 0, 0, 1);
    setM3(_m3.multiply(m_scale));
  }

  //自定义变换
  const [customMatrix, setCustomMatrix] = useState(
    [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ]);

  const handleCustomTransform = (customMatrix) => {
    // console.log(customMatrix);
    // console.log(m3);
    const m_custom = new Matrix3();
    const _m3 = m3.clone();
    m_custom.set(...customMatrix);
    // m_custom.transpose();
    setM3(_m3.multiply(m_custom));
  }



  //重置变换矩阵

  const handleReset = () => {
    setM3(new Matrix3());
  }


  //最终应用变换
  const handleApplyTransform = (index) => {
    pen.applyTransformAt(index, m3);
  }


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




  const style_transformBlock = {
    border: '1px solid #ccc',
    padding: '10px',
  }


  return (
    <div>

      <button onClick={() => setOnTransform(!onTransform)}>变换</button>
      {
        onTransform === false
          ? null
          : <>
            <Matrix3Visual matrix={m3} />
            <button onClick={() => handleReset()}>重置</button>

            <div style={style_transformBlock}>
              <p>平移变换</p>
              x<Slider min={-1} max={1} step={0.01} value={offsetX} onChange={setOffsetX} >x</Slider>
              y<Slider min={-1} max={1} step={0.01} value={offsetY} onChange={setOffsetY} >y</Slider>
              <button onClick={() => handleOffset(offsetX, offsetY)}>平移变换</button>
            </div>
            <div style={style_transformBlock}>
              <p>角度变换</p>
              <Slider min={-180} max={180} step={1} value={angle} onChange={setAngle} >旋转</Slider>
              <Switch checkedChildren="顺时针" unCheckedChildren="逆时针"
                onChange={() => setClockwise(!clockwise)} checked={clockwise} />
              <p />
              <button onClick={() => handleRotate(clockwise, angle)}>角度变换</button>
            </div>
            <div style={style_transformBlock}>
              <p>缩放变换</p>
              x<Slider min={0.1} max={2} step={0.01} value={scaleX} onChange={setScaleX} >x</Slider>
              y<Slider min={0.1} max={2} step={0.01} value={scaleY} onChange={setScaleY} >y</Slider>
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


            <button onClick={() => handleApplyTransform(index)}>应用变换</button>
          </>
      }
    </div>
  )




}

export default TransformBox;
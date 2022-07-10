import { Matrix4 } from "three";

/**
 * 
 * @param {Number[]} v1 
 * @param {Number[]} v2 
 * @returns {Number[]}
 */
export function crossV3(v1, v2) {
  return [
    v1[1] * v2[2] - v1[2] * v2[1],
    v2[0] * v1[2] - v2[2] * v1[0],
    v1[0] * v2[1] - v1[1] * v2[0]
  ];
}


export class M4 {

  constructor() {
    this.elements = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  }

  /**
   * 获取位于row,col的元素  
   */
  get(row, col) {
    if (row < 0 || row > 3 || col < 0 || col > 3) {
      throw new Error('Invalid row or column');
    }
    return this.elements[row * 4 + col];
  }

  /**
   * 注:不改变自身,返回一个新的矩阵M4
   * @param {M4} m 
   * @returns 
   */
  multiply(m) {
    let e1 = this.elements;
    let e2 = m.elements;
    let res = new M4();
    res.elements = new Array(16);
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {

        let temp = 0;

        for (let j = 0; j < 4; j++) {
          temp += e1[row * 4 + j] * e2[j * 4 + col];
        }

        // console.log('temp: ', temp);
        res.elements[row * 4 + col] = temp;
      }
    }

    return res;

  }

  /**
   * 
   * @param {Number[]} eye - 摄像机所在位置
   * @param {Number[]} target - 目标所在位置
   * @param {Number[]} up - 摄像机的上方向
   */
  lookAt(eye, target, up) {
    //如何实现lookAt矩阵？
    //1.求出摄像机看向目标的方向
    let eyeToTarget = [eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]];
    //2.求出1的右方向
    let right = crossV3(up, eyeToTarget);
    //3.获取摄像机看向目标的上方向
    let up2 = crossV3(eyeToTarget, right);

    //lookat矩阵的组成：
    //其中R为右向量
    //U为上向量
    //D为摄像机看向目标的方向
    //P为摄像机的位置

    //  R.x R.y R.z 0   *   1 0 0 -P.x 
    //  U.x U.y U.z 0       0 1 0 -P.y
    //  D.x D.y D.z 0       0 0 1 -P.z
    //  0   0   0   1       0 0 0 1

    let m1 = new M4();
    m1.elements = [
      right[0], right[1], right[2], 0,
      up2[0], up2[1], up2[2], 0,
      eyeToTarget[0], eyeToTarget[1], eyeToTarget[2], 0,
      0, 0, 0, 1
    ];

    let m2 = new M4();
    m2.elements = [
      1, 0, 0, -eye[0],
      0, 1, 0, -eye[1],
      0, 0, 1, -eye[2],
      0, 0, 0, 1
    ];
    // console.log('m1: ', m1, 'm2: ', m2);
    return m1.multiply(m2);

  }



  inverse() {
    //偷懒了，直接用矩阵的逆矩阵
    let m = this.elements
    let res = new M4();
    let dst = res.elements;

    let m00 = m[0 * 4 + 0];
    let m01 = m[0 * 4 + 1];
    let m02 = m[0 * 4 + 2];
    let m03 = m[0 * 4 + 3];
    let m10 = m[1 * 4 + 0];
    let m11 = m[1 * 4 + 1];
    let m12 = m[1 * 4 + 2];
    let m13 = m[1 * 4 + 3];
    let m20 = m[2 * 4 + 0];
    let m21 = m[2 * 4 + 1];
    let m22 = m[2 * 4 + 2];
    let m23 = m[2 * 4 + 3];
    let m30 = m[3 * 4 + 0];
    let m31 = m[3 * 4 + 1];
    let m32 = m[3 * 4 + 2];
    let m33 = m[3 * 4 + 3];
    let tmp_0 = m22 * m33;
    let tmp_1 = m32 * m23;
    let tmp_2 = m12 * m33;
    let tmp_3 = m32 * m13;
    let tmp_4 = m12 * m23;
    let tmp_5 = m22 * m13;
    let tmp_6 = m02 * m33;
    let tmp_7 = m32 * m03;
    let tmp_8 = m02 * m23;
    let tmp_9 = m22 * m03;
    let tmp_10 = m02 * m13;
    let tmp_11 = m12 * m03;
    let tmp_12 = m20 * m31;
    let tmp_13 = m30 * m21;
    let tmp_14 = m10 * m31;
    let tmp_15 = m30 * m11;
    let tmp_16 = m10 * m21;
    let tmp_17 = m20 * m11;
    let tmp_18 = m00 * m31;
    let tmp_19 = m30 * m01;
    let tmp_20 = m00 * m21;
    let tmp_21 = m20 * m01;
    let tmp_22 = m00 * m11;
    let tmp_23 = m10 * m01;

    let t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
      (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
    let t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
      (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
    let t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
      (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
    let t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
      (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

    let d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

    dst[0] = d * t0;
    dst[1] = d * t1;
    dst[2] = d * t2;
    dst[3] = d * t3;
    dst[4] = d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
      (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
    dst[5] = d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
      (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
    dst[6] = d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
      (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
    dst[7] = d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
      (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
    dst[8] = d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
      (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
    dst[9] = d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
      (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
    dst[10] = d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
      (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
    dst[11] = d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
      (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
    dst[12] = d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
      (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
    dst[13] = d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
      (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
    dst[14] = d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
      (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
    dst[15] = d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
      (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));
    // console.log("dst:",dst)
    return res;

  }

  /**
   * Computes a 4-by-4 perspective transformation matrix given the angular height
   * of the frustum, the aspect ratio, and the near and far clipping planes.  The
   * arguments define a frustum extending in the negative z direction.  The given
   * angle is the vertical angle of the frustum, and the horizontal angle is
   * determined to produce the given aspect ratio.  The arguments near and far are
   * the distances to the near and far clipping planes.  Note that near and far
   * are not z coordinates, but rather they are distances along the negative
   * z-axis.  The matrix generated sends the viewing frustum to the unit box.
   * We assume a unit box extending from -1 to 1 in the x and y dimensions and
   * from -1 to 1 in the z dimension.
   * @param {number} fieldOfViewInRadians field of view in y axis.
   * @param {number} aspect aspect of viewport (width / height)
   * @param {number} near near Z clipping plane
   * @param {number} far far Z clipping plane
   * @param {Matrix4} [dst] optional matrix to store result
   * @return {Matrix4} dst or a new matrix if none provided
   * @memberOf module:webgl-3d-math
   */
  perspective(fieldOfViewInRadians, aspect, near, far, dst) {
    dst = dst || new M4();
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);

    dst.elements[0] = f / aspect;
    dst.elements[1] = 0;
    dst.elements[2] = 0;
    dst.elements[3] = 0;
    dst.elements[4] = 0;
    dst.elements[5] = f;
    dst.elements[6] = 0;
    dst.elements[7] = 0;
    dst.elements[8] = 0;
    dst.elements[9] = 0;
    dst.elements[10] = (near + far) * rangeInv;
    dst.elements[11] = -1;
    dst.elements[12] = 0;
    dst.elements[13] = 0;
    dst.elements[14] = near * far * rangeInv * 2;
    dst.elements[15] = 0;

    return dst;
  }


}



export function testRun() {
  let m1 = new M4();
  m1.elements = [
    -1, 0, 0, 0,
    0, 1 / 2, 0, 0,
    0, 0, 1 / 3, 0,
    0, 0, 0, 4
  ];
  // let m2 = new M4();
  // m2.elements = [
  //   1, 2, 3, 4,
  //   5, 6, 7, 8,
  //   9, 10, 11, 12,
  //   13, 14, 15, 16
  // ];

  // console.log(m1.multiply(m2));


  // console.log(m1.invert());
}
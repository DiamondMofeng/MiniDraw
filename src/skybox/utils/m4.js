


/**
 * normalizes a vector.
 * @param {Vector3} v vector to normalize
 * @param {Vector3} dst optional vector3 to store result
 * @return {Vector3} dst or new Vector3 if not provided
 * @memberOf module:webgl-3d-math
 */
function normalize(v, dst) {
  dst = dst || new Array(3);
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    dst[0] = v[0] / length;
    dst[1] = v[1] / length;
    dst[2] = v[2] / length;
  }
  return dst;
}


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
   * Takes two 4-by-4 matrices, a and b, and computes the product in the order
   * that pre-composes b with a.  In other words, the matrix returned will
   * transform by b first and then a.  Note this is subtly different from just
   * multiplying the matrices together.  For given a and b, this function returns
   * the same object in both row-major and column-major mode.
   * @param {M4} a A matrix.
   * @param {M4} b A matrix.
   * @return {M4} dst or a new matrix if none provided
   */
  static multiplyBetween(a, b) {
    let dst = new M4();
    var b00 = b.elements[0 * 4 + 0];
    var b01 = b.elements[0 * 4 + 1];
    var b02 = b.elements[0 * 4 + 2];
    var b03 = b.elements[0 * 4 + 3];
    var b10 = b.elements[1 * 4 + 0];
    var b11 = b.elements[1 * 4 + 1];
    var b12 = b.elements[1 * 4 + 2];
    var b13 = b.elements[1 * 4 + 3];
    var b20 = b.elements[2 * 4 + 0];
    var b21 = b.elements[2 * 4 + 1];
    var b22 = b.elements[2 * 4 + 2];
    var b23 = b.elements[2 * 4 + 3];
    var b30 = b.elements[3 * 4 + 0];
    var b31 = b.elements[3 * 4 + 1];
    var b32 = b.elements[3 * 4 + 2];
    var b33 = b.elements[3 * 4 + 3];
    var a00 = a.elements[0 * 4 + 0];
    var a01 = a.elements[0 * 4 + 1];
    var a02 = a.elements[0 * 4 + 2];
    var a03 = a.elements[0 * 4 + 3];
    var a10 = a.elements[1 * 4 + 0];
    var a11 = a.elements[1 * 4 + 1];
    var a12 = a.elements[1 * 4 + 2];
    var a13 = a.elements[1 * 4 + 3];
    var a20 = a.elements[2 * 4 + 0];
    var a21 = a.elements[2 * 4 + 1];
    var a22 = a.elements[2 * 4 + 2];
    var a23 = a.elements[2 * 4 + 3];
    var a30 = a.elements[3 * 4 + 0];
    var a31 = a.elements[3 * 4 + 1];
    var a32 = a.elements[3 * 4 + 2];
    var a33 = a.elements[3 * 4 + 3];
    dst.elements[0] = b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30;
    dst.elements[1] = b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31;
    dst.elements[2] = b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32;
    dst.elements[3] = b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33;
    dst.elements[4] = b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30;
    dst.elements[5] = b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31;
    dst.elements[6] = b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32;
    dst.elements[7] = b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33;
    dst.elements[8] = b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30;
    dst.elements[9] = b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31;
    dst.elements[10] = b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32;
    dst.elements[11] = b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33;
    dst.elements[12] = b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30;
    dst.elements[13] = b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31;
    dst.elements[14] = b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32;
    dst.elements[15] = b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33;
    return dst;
  }

  /**
   * 
   * @param {Number[]} eye - 摄像机所在位置
   * @param {Number[]} target - 目标所在位置
   * @param {Number[]} up - 摄像机的上方向
   */
  static lookAt(eye, target, up) {
    //如何实现lookAt矩阵？
    //1.求出摄像机看向目标的方向
    let eyeToTarget = normalize([eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]]);
    //2.求出1的右方向
    let right = normalize(crossV3(up, eyeToTarget));
    //3.获取摄像机看向目标的上方向
    let up2 = normalize(crossV3(eyeToTarget, right));

    //lookat矩阵的组成：
    //其中R为右向量
    //U为上向量
    //D为摄像机看向目标的方向
    //P为摄像机的位置

    //  R.x R.y R.z 0   *   1 0 0 -P.x 
    //  U.x U.y U.z 0       0 1 0 -P.y
    //  D.x D.y D.z 0       0 0 1 -P.z
    //  0   0   0   1       0 0 0 1
    //* 废案
    // let m1 = new M4();
    // m1.elements = [
    //   right[0], right[1], right[2], 0,
    //   up2[0], up2[1], up2[2], 0,
    //   eyeToTarget[0], eyeToTarget[1], eyeToTarget[2], 0,
    //   0, 0, 0, 1
    // ];

    // let m2 = new M4();
    // m2.elements = [
    //   1, 0, 0, -eye[0],
    //   0, 1, 0, -eye[1],
    //   0, 0, 1, -eye[2],
    //   0, 0, 0, 1
    // ];
    // // console.log('m1: ', m1, 'm2: ', m2);
    // return m1.multiply(m2);

    let res = new M4();
    res.elements = [
      right[0], right[1], right[2], 0,
      up2[0], up2[1], up2[2], 0,
      eyeToTarget[0], eyeToTarget[1], eyeToTarget[2], 0,
      eye[0], eye[1], eye[2], 1
    ];
    return res;
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
   * @param {M4} [dst] optional matrix to store result
   * @return {M4} dst or a new matrix if none provided
   * @memberOf module:webgl-3d-math
   */
  static perspective(fieldOfViewInRadians, aspect, near, far, dst) {
    dst = dst || new M4();
    let f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    let rangeInv = 1.0 / (near - far);

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
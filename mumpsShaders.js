const mumpsShaders = [

    `uniform mat2 videoTransformMat2;\n\
    varying vec2 vUVvideo;\n\

    
    // deformation 1 parameters:\n\
    const vec2 TEARPOINT2 = vec2(-0.3, -0.72);\n\
    const vec2 DISPLACEMENT2 = vec2(-0.15, -0.05);\n\
    const float RADIUS2 = 0.4;\n\


    // deformation 2 parameters:\n\
    const vec2 TEARPOINT3 = vec2(0.3, -0.72);\n\
    const vec2 DISPLACEMENT3 = vec2(0.15,-0.05);\n\
    const float RADIUS3 = 0.4;\n\

    // main
    void main() {\n\
      vec3 positionDeformed=position;\n\
  
      
      // apply deformation 1\n\
      float deformFactor2 = 1. - smoothstep(0.0, RADIUS2, distance(TEARPOINT2, position.xy));\n\
      positionDeformed.xy += deformFactor2 * DISPLACEMENT2;\n\

      // apply deformation 2\n\
      float deformFactor3 = 1. - smoothstep(0.0, RADIUS3, distance(TEARPOINT3, position.xy));\n\
      positionDeformed.xy += deformFactor3 * DISPLACEMENT3;\n\



      // project deformed point:\n\
      vec4 mvPosition = modelViewMatrix * vec4( positionDeformed, 1.0 );\n\
      vec4 projectedPosition=projectionMatrix * mvPosition;\n\
      gl_Position=projectedPosition;\n\
      // compute UV coordinates on the video texture:\n\
      vec4 mvPosition0 = modelViewMatrix * vec4( position, 1.0 );\n\
      vec4 projectedPosition0 = projectionMatrix * mvPosition0;\n\
      vUVvideo = vec2(0.5) + videoTransformMat2 * projectedPosition0.xy / projectedPosition0.w;\n\
    }`,

    // FIRST VARIATION
    
   /*  `uniform mat2 videoTransformMat2;\n\
    varying vec2 vUVvideo;\n\
    // deformation 0 parameters:\n\
    const vec2 TEARPOINT0 = vec2(-0.31,-0.62);\n\
    const vec2 DISPLACEMENT0 = vec2(-0.22,-0.5);\n\
    const float RADIUS0 = 0.3;\n\

    // deformation 2 parameters:\n\
    const vec2 TEARPOINT2 = vec2(-0.3, -0.62);\n\
    const vec2 DISPLACEMENT2 = vec2(-0.23,-0.2);\n\
    const float RADIUS2 = 0.4;\n\
    void main() {\n\
      vec3 positionDeformed=position;\n\
  
      
      // apply deformation 2\n\
      float deformFactor2 = 1. - smoothstep(0.0, RADIUS2, distance(TEARPOINT2, position.xy));\n\
      positionDeformed.xy += deformFactor2 * DISPLACEMENT2;\n\

      // project deformed point:\n\
      vec4 mvPosition = modelViewMatrix * vec4( positionDeformed, 1.0 );\n\
      vec4 projectedPosition=projectionMatrix * mvPosition;\n\
      gl_Position=projectedPosition;\n\
      // compute UV coordinates on the video texture:\n\
      vec4 mvPosition0 = modelViewMatrix * vec4( position, 1.0 );\n\
      vec4 projectedPosition0 = projectionMatrix * mvPosition0;\n\
      vUVvideo = vec2(0.5) + videoTransformMat2 * projectedPosition0.xy / projectedPosition0.w;\n\
    }`, 

    // SECOND VARIATION 

    `uniform mat2 videoTransformMat2;\n\
    varying vec2 vUVvideo;\n\
    // deformation 0 parameters:\n\
    const vec2 TEARPOINT0 = vec2(0.31,-0.62);\n\
    const vec2 DISPLACEMENT0 = vec2(0.22,-0.5);\n\
    const float RADIUS0 = 0.3;\n\

    // deformation 1 parameters:\n\
    const vec2 TEARPOINT1 = vec2(0.27,-0.72);\n\
    const vec2 DISPLACEMENT1 = vec2(0.22,-0.7);\n\
    const float RADIUS1 = 0.3;\n\

    // deformation 2 parameters:\n\
    const vec2 TEARPOINT2 = vec2(0.3, -0.62);\n\
    const vec2 DISPLACEMENT2 = vec2(0.23,-0.2);\n\
    const float RADIUS2 = 0.4;\n\
    void main() {\n\
      vec3 positionDeformed=position;\n\
  
      
      // apply deformation 2\n\
      float deformFactor2 = 1. - smoothstep(0.0, RADIUS2, distance(TEARPOINT2, position.xy));\n\
      positionDeformed.xy += deformFactor2 * DISPLACEMENT2;\n\
      

      // project deformed point:\n\
      vec4 mvPosition = modelViewMatrix * vec4( positionDeformed, 1.0 );\n\
      vec4 projectedPosition=projectionMatrix * mvPosition;\n\
      gl_Position=projectedPosition;\n\
      // compute UV coordinates on the video texture:\n\
      vec4 mvPosition0 = modelViewMatrix * vec4( position, 1.0 );\n\
      vec4 projectedPosition0 = projectionMatrix * mvPosition0;\n\
      vUVvideo = vec2(0.5) + videoTransformMat2 * projectedPosition0.xy / projectedPosition0.w;\n\
    }`  */
]
import React from 'react'

const ImagePlaceholder = ({ 
  emoji, 
  text, 
  width = '100%', 
  height = '200px', 
  className = '',
  onClick = null 
}) => {
  return (
    <div 
      className={`image-placeholder ${className}`}
      style={{ width, height }}
      onClick={onClick}
    >
      <div className="placeholder-content">
        <div className="placeholder-emoji">{emoji}</div>
        <div className="placeholder-text">{text}</div>
      </div>
    </div>
  )
}

export default ImagePlaceholder

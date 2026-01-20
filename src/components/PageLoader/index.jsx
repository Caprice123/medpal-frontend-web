import React from 'react';
import { LoaderWrapper, LogoContainer, LogoImage, SpinnerRing, LoaderText } from './PageLoader.styles';

const PageLoader = ({ fullScreen = true, text = 'Loading...', size = 80 }) => {
  return (
    <LoaderWrapper fullScreen={fullScreen}>
      <LogoContainer>
        <LogoImage
          src="/icon.jpg"
          alt="Loading"
          size={`${fullScreen ? size : size * 0.6}px`}
          fullScreen={fullScreen}
        />
      </LogoContainer>
      {text && <LoaderText fullScreen={fullScreen}>{text}</LoaderText>}
    </LoaderWrapper>
  );
};

export default PageLoader;
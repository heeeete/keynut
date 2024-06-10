'use client';

import Script from 'next/script';

const kakao_js_key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
const kakao_redirect_uri = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI;

export default function Login() {
  function kakaoInit() {
    window.Kakao.init(kakao_js_key);
    console.log(window.Kakao.isInitialized());
  }

  function kakaoLogin() {
    window.Kakao.Auth.authorize({
      redirectUri: kakao_redirect_uri,
    });
  }

  return (
    <div>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
        integrity="sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4"
        crossorigin="anonymous"
        onLoad={kakaoInit}
      ></Script>
      <button onClick={kakaoLogin}>카카오톡</button>
    </div>
  );
}

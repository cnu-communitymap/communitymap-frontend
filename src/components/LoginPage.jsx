import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@/styles/LoginPage.css';
import AccessTokenContext from '@/components/AccessTokenContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAccessToken } = useContext(AccessTokenContext);
  const navigate = useNavigate();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://118.67.154.247/mapcommu/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다.');
      }

      // 로그인 성공 후 처리, 예: 사용자 정보 저장, 홈페이지로 리다이렉트 등
      const data = await response.json();
    
      setAccessToken(data.accessToken); // accessToken 저장

      navigate('/'); // Map 컴포넌트로 리다이렉트

    } catch (error) {
      console.error('로그인 에러:', error);
      // 로그인 실패 시 에러 메시지 표시 등
      alert('이메일 또는 비밀번호가 틀렸습니다.'); // 에러 메세지를 alert로 표시한다.
      setEmail(''); // 이메일 입력 칸을 초기화
      setPassword(''); // 비밀번호 입력 칸을 초기화
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <Link to="/signup">
        <button className="sign-up-button">Sign Up</button>
      </Link>
    </div>
  );
}

export default LoginPage;
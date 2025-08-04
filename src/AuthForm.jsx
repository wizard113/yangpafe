import React, { useState } from 'react';
import './AuthForm.css';

export default function AuthForm() {
  const [mode, setMode] = useState('sign-up');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint =
      mode === 'sign-up'
        ? `${process.env.REACT_APP_API_HOST}/members/sign-up`
        : `${process.env.REACT_APP_API_HOST}/members/sign-in`;
    console.log(endpoint);
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (mode === 'sign-in' && data.token) {
          //로그인 성공 시 토큰 저장하기
          localStorage.setItem('token', data.token);
          // sessionStorage.setItem('token', data.token);
          // const token = localStorage.getItem('token');//token 읽어오기
          setMessage('로그인 성공! 토큰이 저장되었습니다.');
        } else {
          setMessage('회원가입 성공! v1');
        }
        console.log('성공:', data);
      } else {
        setMessage(
          data.message || `${mode === 'sign-up' ? '회원가입' : '로그인'} 실패`
        );
        console.error('에러:', data);
      }
    } catch (error) {
      setMessage('서버 오류');
      console.error('요청 실패:', error);
    }
  };

  return (
    <div className="auth-container">
      <h2>{mode === 'sign-up' ? '회원가입' : '로그인'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="아이디"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          {mode === 'sign-up' ? '가입하기' : '로그인'}
        </button>
      </form>

      <button
        className="toggle-btn"
        onClick={() => {
          setMode(mode === 'sign-up' ? 'sign-in' : 'sign-up');
          setMessage('');
        }}
      >
        {mode === 'sign-up'
          ? '이미 계정이 있으신가요? 로그인'
          : '계정이 없으신가요? 회원가입'}
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

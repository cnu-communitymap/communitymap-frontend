// utils.jsx 파일 입니다.
// accessToken을 통해 서버로부터 user의 데이터를 받아와 이용하기 위한 함수를 정의한 곳입니다. ( 여러 곳에서 import 해서 사용할 수 있음)

export async function fetchUserData(accessToken) {
  try {
    const response = await fetch('http://118.67.154.247/mapcommu/user/mypage', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}


// LocalStorage를 사용하여 로그인한 user의 토큰을 저장하고 있는 상태로 만들어주는 함수입니다.

// utils/tokenStorage.js
export const storeAccessToken = (token) => {
  localStorage.setItem('accessToken', token);
};

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const removeAccessToken = () => {
  localStorage.removeItem('accessToken');
};
import React, { useEffect } from 'react';
import '@/styles/Map.css';
import zoomInButtonImg from '@/assets/images/zoomin.svg';
import zoomOutButtonImg from '@/assets/images/zoomout.svg';
import loc_now_btn_Img from "@/assets/images/loc_now_btn.svg";
import write_buttonImg from "@/assets/images/write_button.svg";
import location_now_personImg from "@/assets/images/location_now_person.svg";
import { infoIcon, foodIcon, talkIcon } from '@/assets/images';
import { infoMarkerImg, foodMarkerImg, talkMarkerImg } from '@/assets/images';

const { kakao } = window;

function Map() {
  useEffect(() => {
    const container = document.getElementById('map');
    navigator.geolocation.getCurrentPosition(function (position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const userLatLng = new kakao.maps.LatLng(lat, lng);

      const options = {
        center: userLatLng,
        level: 3,
        minLevel: 1,
        maxLevel: 4,
      };

      const map = new kakao.maps.Map(container, options);

      // ZoomControl 추가
      const zoomControl = new kakao.maps.ZoomControl();
      map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);


      // 사용자의 현재 위치에 마커를 표시
      const imageSrc = location_now_personImg;
      const imageSize = new kakao.maps.Size(45, 45);
      const imageOption = { offset: new kakao.maps.Point(27, 69) };
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
      const userMarker = new kakao.maps.Marker({
        position: userLatLng,
        map: map,
        image: markerImage,
      });
      userMarker.setMap(map);


      // 현재 위치 버튼 클릭 시, 현재 위치로 지도 이동
      const locationButton = document.querySelector('.locationButton');
      locationButton.addEventListener('click', () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const latLng = new kakao.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.panTo(latLng);
          });
        }
      });

      // 확대 버튼 클릭 시, 지도 확대
      const zoomInButton = document.querySelector('.zoomInButton');
      zoomInButton.addEventListener('click', () => {
        map.setLevel(map.getLevel() - 1);
      });

      // 축소 버튼 클릭 시, 지도 축소
      const zoomOutButton = document.querySelector('.zoomOutButton');
      zoomOutButton.addEventListener('click', () => {
        map.setLevel(map.getLevel() + 1);
      });



      // 서버에서 데이터를 받아와 카테고리별 마커 생성

      const category = [ 'INFO', 'FOOD', 'TALK']; 

      // 마커가 표시될 좌표 서버에서 불러와서 배열 생성
      const infoPositions = [];
      const foodPositions = [];
      const talkPositions = [];

      fetch(`http://175.106.91.172:9090/post/category?category=${category[0]}`)
        .then(response => response.json())
        .then((data) => {
          data.forEach(id => {
            const infoPosition = new kakao.maps.LatLng(id.position.latitude, id.position.longitude);
            infoPositions.push(infoPosition);
          })
        });

      fetch(`http://175.106.91.172:9090/post/category?category=${category[1]}`)
        .then(response => response.json())
        .then((data) => {
          data.forEach(id => {
            const foodPosition = new kakao.maps.LatLng(id.position.latitude, id.position.longitude);
            foodPositions.push(foodPosition);
          })
        });

      fetch(`http://175.106.91.172:9090/post/category?category=${category[2]}`)
        .then(response => response.json())
        .then((data) => {
          data.forEach(id => {
            const talkPosition = new kakao.maps.LatLng(id.position.latitude, id.position.longitude);
            talkPositions.push(talkPosition);
          })
        });

      
      // 마커 객체를 가지고 있을 배열입니다
      const infoMarkers = [];
      const foodMarkers = [];
      const talkMarkers = [];


      // 마커이미지의 주소, 크기, 옵션으로 마커 이미지를 생성하여 리턴하는 함수입니다
      const createMarkerImage = (srcArr, size, options) => {
        const markerImages = [];
        srcArr.forEach((src) => {
          const markerImage = new kakao.maps.MarkerImage(src, size, options);
          markerImages.push(markerImage);
        });
        return markerImages;
      }

      const markerImages = createMarkerImage([infoMarkerImg, foodMarkerImg, talkMarkerImg], new kakao.maps.Size(45, 45), { offset: new kakao.maps.Point(27, 69) });


      // 좌표와 마커이미지를 받아 마커를 생성하여 리턴하는 함수입니다
      const createMarker = (position, image) => {
        const marker = new kakao.maps.Marker({
          position: position,
          image: image
        });
        return marker;
      }   


      // 카테고리별로 마커를 생성하고 해ㅏㄷㅇ 마커 배열에 추가하는 함수입니다

      const createInfoMarkers = () => {
        for (let i = 0; i < infoPositions.length; i++) {
          const marker = createMarker(infoPositions[i], markerImages[0]);
          infoMarkers.push(marker);
        }
      };

      const setInfoMarkers = (map) => {
        for (let i = 0; i < infoMarkers.length; i++) {
          infoMarkers[i].setMap(map);
        }
      };

      const createFoodMarkers = () => {
        for (let i = 0; i < foodPositions.length; i++) {
          const marker = createMarker(foodPositions[i], markerImages[1]);
          foodMarkers.push(marker);
        }
      };

      const setFoodMarkers = (map) => {
        for (let i = 0; i < foodMarkers.length; i++) {
          foodMarkers[i].setMap(map);
        }
      };

      const createTalkMarkers = () => {
        for (let i = 0; i < talkPositions.length; i++) {
          const marker = createMarker(talkPositions[i], markerImages[2]);
          talkMarkers.push(marker);
        }
      };

      const setTalkMarkers = (map) => {
        for (let i = 0; i < talkMarkers.length; i++) {
          talkMarkers[i].setMap(map);
        }
      };
      
      // 카테고리를 클릭했을 때 type에 따라 지도에 표시되는 마커를 변경합니다
      const changeMarker = (type) => {
        if (type === 'info') {
          createInfoMarkers();
          setInfoMarkers(map);
          setFoodMarkers(null);
          setTalkMarkers(null);

        } else if (type === 'food') {
          createFoodMarkers();
          setInfoMarkers(null);
          setFoodMarkers(map);
          setTalkMarkers(null);

        } else if (type === 'talk') {
          createTalkMarkers();
          setInfoMarkers(null);
          setFoodMarkers(null);
          setTalkMarkers(map);
        };
      }

      // 카테고리 버튼을 누르면 해당 마커가 표시됩니다
      const infoBtn = document.querySelector('.infoBtn');
      infoBtn.addEventListener('click', () => {
        changeMarker('info');
      });

      const foodBtn = document.querySelector('.foodBtn');
      foodBtn.addEventListener('click', () => {
        changeMarker('food');
      });

      const talkBtn = document.querySelector('.talkBtn');
      talkBtn.addEventListener('click', () => {
        changeMarker('talk');
      });


    });
  }, []);

  return (
    <div>
      <div id="map"></div>
      <div className='category'>
        <img src={infoIcon} alt="정보 카테고리" className='infoBtn' />
        <img src={foodIcon} alt="맛집 카테고리" className='foodBtn' />
        <img src={talkIcon} alt="수다 카테고리" className='talkBtn' />
      </div>
      <div className='zoomControl'>
        <img src={zoomInButtonImg} alt="확대 버튼" className="zoomInButton" />
        <img src={zoomOutButtonImg} alt="축소 버튼" className="zoomOutButton" />
      </div>
      <div className="location">
        <img src={loc_now_btn_Img} alt="현재 위치 버튼" className="locationButton" />
      </div>
      <div className="write">
        <img src={write_buttonImg} alt="글쓰기 버튼" className="write_button" />
      </div>
    </div>
  );
}

export default Map;
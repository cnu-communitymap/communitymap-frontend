import React, { useEffect, useContext } from 'react';
import AccessTokenContext from '@/components/AccessTokenContext';
import '@/styles/Map.css';
import zoomInButtonImg from '@/assets/images/zoomin.svg';
import zoomOutButtonImg from '@/assets/images/zoomout.svg';
import loc_now_btn_Img from "@/assets/images/loc_now_btn.svg";
import write_buttonImg from "@/assets/images/write_button.svg";
import location_now_personImg from "@/assets/images/location_now_person.svg";
import { infoIcon, foodIcon, talkIcon } from '@/assets/images';
import { infoMarkerImg, foodMarkerImg, talkMarkerImg } from '@/assets/images';
import  defaultImg  from '@/assets/images/defaultImg.svg';
const { kakao } = window;

let currentOverlay = null;

function Map({ openSidePage }) {
  const { accessToken } = useContext(AccessTokenContext);
  
  

  const handleWriteButtonClick = () => {
    openSidePage('write');
  };

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

      // // ZoomControl 추가
      // const zoomControl = new kakao.maps.ZoomControl();
      // map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

      const handleMarkerClick = (data, marker) => {
        if ( currentOverlay ) {
          currentOverlay.setMap(null);
        }

        const content = `<div class="overlay_wrap">
        <div class="overlay_info">
          <div class="overlay_title">${data.title}<div class="overlay_close" title="닫기" /></div>
          <div class="overlay_body">
          <img class="overlay_image" src="${data.imageUrl ? data.imageUrl : defaultImg}" alt="이미지 오류">
            <div class="overlay_desc">
              <div class="overlay_content">${data.content}</div>
            </div>
          </div>
        <div>
      </div>`;

        const contentElement = document.createElement("div");
        contentElement.innerHTML = content;
        
        const customOverlay = new kakao.maps.CustomOverlay({
          content: contentElement,
          position: marker.getPosition(),
          xAnchor: 0.5,
          yAnchor: 1.5,
          zIndex: 3,
        });
      
        customOverlay.setMap(map);
      // 닫기 버튼에 이벤트 리스너를 추가
      const closeButton = customOverlay.getContent().querySelector(".overlay_close");
      closeButton.addEventListener("click", () => {
        customOverlay.setMap(null);
        currentOverlay = null;
        });
      
      const readButton = contentElement.querySelector(".overlay_body");
      readButton.addEventListener("click", () => {
        openSidePage("read", { title: data.title, content: data.content, id: data.id, imageUrl: data.imageUrl });
        customOverlay.setMap(null);
        currentOverlay = null;
      });

      // 현재 생성된 오버레이를 추적함.
      currentOverlay = customOverlay;

        // customOverlay를 닫는 기능을 추가합니다.
        kakao.maps.event.addListener(customOverlay, 'click', () => {
          customOverlay.setMap(null);
          currentOverlay = null;
        });
      };
      const createMarkerAndAddClickListener = (marker, data) => {
        kakao.maps.event.addListener(marker, 'click', () => {
          handleMarkerClick(data, marker);
        });
      };


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
      const category = ['INFO', 'FOOD', 'TALK'];

      const fetchAndCreateMarkers = async (category) => {
        const response = await fetch(`http://118.67.154.247/mapcommu/post/category?category=${category}`);
        const data = await response.json();
        const positions = data.map((item) => {
          return {
            position: new kakao.maps.LatLng(item.position.latitude, item.position.longitude),
            title: item.title,
            content: item.content,
            id: item.id,
            imageUrl: item.imageUrl
          };
        });
    
        return positions;
      };
    
      const createMarkers = async () => {
        const infoPositions = await fetchAndCreateMarkers(category[0]);
        const foodPositions = await fetchAndCreateMarkers(category[1]);
        const talkPositions = await fetchAndCreateMarkers(category[2]);
    
        return { infoPositions, foodPositions, talkPositions };
      };
    
      createMarkers().then(({ infoPositions, foodPositions, talkPositions }) => {
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
        };
    
        const markerImages = createMarkerImage(
          [infoMarkerImg, foodMarkerImg, talkMarkerImg],
          new kakao.maps.Size(45, 45),
          { offset: new kakao.maps.Point(27, 69) },
        );
    
        // 좌표와 마커이미지를 받아 마커를 생성하여 리턴하는 함수입니다
        const createMarker = (position, image) => {
          const marker = new kakao.maps.Marker({
            position: position,
            image: image,
          });
          return marker;
        };
    
        // 카테고리별로 마커를 생성하고 해당 마커 배열에 추가하는 함수입니다
        const createCategoryMarkers = (positions, image) => {
          const markers = [];
          positions.forEach((position) => {
            const marker = createMarker(position.position, image);
            createMarkerAndAddClickListener(marker, { title: position.title, content: position.content, id: position.id, imageUrl: position.imageUrl });
            markers.push(marker);
          });
          return markers;
        };
    
        infoMarkers.push(...createCategoryMarkers(infoPositions, markerImages[0]));
        foodMarkers.push(...createCategoryMarkers(foodPositions, markerImages[1]));
        talkMarkers.push(...createCategoryMarkers(talkPositions, markerImages[2]));
    
        // 카테고리별로 지도에 표시되는 마커를 변경합니다
        const changeMarker = (type) => {
          // 기존의 CustomOverlay를 제거하는 코드를 추가합니다.
          if (currentOverlay) {
            currentOverlay.setMap(null);
            currentOverlay = null;
          }

          if (type === 'info') {
            setMarkers(infoMarkers, map);
            setMarkers(foodMarkers, null);
            setMarkers(talkMarkers, null);
          } else if (type === 'food') {
            setMarkers(infoMarkers, null);
            setMarkers(foodMarkers, map);
            setMarkers(talkMarkers, null);
          } else if (type === 'talk') {
            setMarkers(infoMarkers, null);
            setMarkers(foodMarkers, null);
            setMarkers(talkMarkers, map);
          }
        };
    
        // 지도에 마커를 표시하는 함수입니다
        const setMarkers = (markers, map) => {
          for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
          }
        };

        // 카테고리 버튼을 클릭했을 때 호출되는 함수입니다
        const onClickCategory = (selectedCategory) => {
          changeMarker(selectedCategory);
        };

        // 카테고리 버튼에 클릭 이벤트를 등록합니다
        const infoBtn = document.querySelector('.infoBtn');
        const foodBtn = document.querySelector('.foodBtn');
        const talkBtn = document.querySelector('.talkBtn');

        infoBtn.addEventListener('click', () => onClickCategory('info'));
        foodBtn.addEventListener('click', () => onClickCategory('food'));
        talkBtn.addEventListener('click', () => onClickCategory('talk'));

        // 지도가 처음 로드될 때, 정보 카테고리의 마커가 표시되도록 합니다
        changeMarker('info');
      });
    });
  }, []);

    return (
      <div className="Map">
        <div id="map"></div>
        <img className="zoomInButton" src={zoomInButtonImg} alt="확대" />
        <img className="zoomOutButton" src={zoomOutButtonImg} alt="축소" />
        <img className="locationButton" src={loc_now_btn_Img} alt="현재 위치" />
        <img className="writeButton" src={write_buttonImg} alt="글쓰기" onClick={handleWriteButtonClick} style={{ display: accessToken ? 'block' : 'none' }}/> 
        <div className="category"> {/* 카테고리 버튼을 div로 감싸줍니다. */}
          <img className="infoBtn" src={infoIcon} alt="정보" />
          <img className="foodBtn" src={foodIcon} alt="음식" />
          <img className="talkBtn" src={talkIcon} alt="토론" />
        </div>
      </div>
    );}

export default Map;

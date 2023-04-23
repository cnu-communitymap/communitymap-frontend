import React, { useEffect } from 'react';
import '@/styles/Map.css';
import zoomInButtonImg from '@/assets/images/zoomin.svg';
import zoomOutButtonImg from '@/assets/images/zoomout.svg';
import loc_now_btn_Img from "@/assets/images/loc_now_btn.svg";
import write_buttonImg from "@/assets/images/write_button.svg";
import location_now_personImg from "@/assets/images/location_now_person.svg";


const { kakao } = window;

function Map() {
  useEffect(() => {
    const container = document.getElementById('map');
    navigator.geolocation.getCurrentPosition(function(position) {
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


      // 서버에서 데이터를 받아와 마커 생성
      fetch('http://175.106.94.7:8080/post/read?postId=1')
        .then(response => response.json())
        .then((data) => {
          var PostMarker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(data.position.latitude, data.position.longitude),
            title: data.title
          });

          PostMarker.setMap(map);

        });

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

    });
  }, []);

  return (
    <div>
      <div id="map"></div>
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
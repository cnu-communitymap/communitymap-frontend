import React, { useEffect } from "react";
import './Kakao.css'

const { kakao } = window;

function Kakao() {

    useEffect(() => {
        const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
        const options = {
            center: new kakao.maps.LatLng(36.3703, 127.3460), //지도의 중심 좌표
            level: 3
        };
        const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
        map.setMaxLevel(4); // 지도 확대 레벨 제한
    }, [])

    return (
        <div>
            <div id="map"></div>
        </div>
    )
}

export default Kakao;
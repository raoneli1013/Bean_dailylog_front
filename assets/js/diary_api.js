const BACK_BASE_URL = "http://127.0.0.1:8000";
const FRONT_BASE_URL = "http://127.0.0.1:5500";
const token = localStorage.getItem("access");

// 좋아요

export async function LikeLike() {
    const response = await fetch(`${backend_base_url}/diary/${diary_id}/likes/`, {
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method: 'POST',
    })

    response_json = await response.json()
    console.log("start", response_json)
    const like_image = response_json.likes_image
    console.log(like_image)


    if (response.status === 200) {
        alert("하튜")
        if (like_image === true) {
        } else if (like_image === false) {

        }
        location.reload();
    }
}

// 준열님 코드 참고해서 다시작성
// 로그인이 안되어서 제대로 실행되는지 알 수 없는 상태라 약간 안전빵 느낌으로 
// 준열님 코드를 클론코딩해보았습니다.. -소진
export async function ClickLike(diary_id) {
    const url = `${BACK_BASE_URL}/diary/${diary_id}/likes/`;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer` + localStorage.getItem("access"),
                'content-type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Request failed");
        }

        console.log("Request succeeded");
    } catch (error) {
        console.error("Request failed:", error.message);
    }
}
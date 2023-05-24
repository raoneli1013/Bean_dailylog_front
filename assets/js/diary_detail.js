const backend_base_url = "http://127.0.0.1:8000"
const frontend_base_url = "http://127.0.0.1:5500"


// const urlParams = new URL(location.href).searchParams;
//     const diary_id = urlParams.get('id');

let diary_id = 1

window.onload = async function getDiaryDetail() {
    const response = await fetch(`${backend_base_url}/diary` + '/' + diary_id + '/', {
        method: 'GET'
    })
    response_json = await response.json()
    console.log(response_json)

    // 본문 내용
    const title = document.getElementById('title')
    const content = document.getElementById('content')
    const createdDate = document.getElementById('created_date')
    const updatedDate = document.getElementById('updated_date')
    

    title.innerText = response_json['title']
    content.innerText = response_json['content']
    createdDate.innerText = new Date().toDateString(response_json['created_date']) + " 작성"
    updatedDate.innerText = new Date().toDateString(response_json['updated_date']) + " 수정"

    // user 정보
    const response_user = await fetch(`${backend_base_url}` + '/user/profile/' + response_json['user'] + '/', {
        method: 'GET'
    })
    author = await response_user.json()

    // const userProfileImage = document.getElementById('profile_image')
    const nickname = document.getElementById('nickname')

    // userProfileImage.setAttribute('class', 'profile-image')
    // userProfileImage.src = `${backend_base_url}` + response_json['profile_image']
    nickname.innerText = author['nickname']



    const response_comment = await fetch(`${backend_base_url}/diary/comment/${diary_id}`, {
        headers : {
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
        },
        method :"GET"
    })
    const response_json_comment = await response_comment.json()
    console.log(response_json_comment)

    const diaryComment = document.getElementById("diary_comment")
    response_json_comment.forEach(comment => {
        const comment_user = document.createElement('p')
        comment_user.innerText = comment['name']
        diaryComment.appendChild(comment_user)

        const comment_content = document.createElement('p')
        comment_content.innerText = comment['content']
        diaryComment.appendChild(comment_content)
    })
}


async function inputComment() {
    const comment_content = document.getElementById("comment-content").value
    const response_input = await fetch(`${backend_base_url}/diary/comment/${diary_id}/`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("access"),
            'content-type': 'application/json',
        },
        method: "POST",
        body: JSON.stringify({
            "content": comment_content,
        })
    })
    location.reload()
    
}

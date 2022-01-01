'use strict';

let donnees = { choix: [], qoe: [] };
let videos = ["V1Q1", "V1Q2", "V1Q3", "V2Q1", "V2Q2", "V2Q3", "V3Q1", "V3Q2", "V3Q3"]
let order
let video_to_play


async function generate_user_id() {
    //on récupère le nombre de lignes du csv
    return await getFromAPI("http://localhost:3000/get_last_cobaye_id") + 1
}

function randomize(id_user) {
    for (let i = videos.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [videos[i], videos[j]] = [videos[j], videos[i]];
    }
    order = {
        interface: ((id_user % 2) === 0 ? [1, 2] : [2, 1]),
        video_IA_order: videos.slice(0, 4),
        video_IB_order: videos.slice(4, videos.length),
    }
    donnees.ordre = JSON.parse(JSON.stringify(order))

}

function load_video_extract() {
    hide_everything()
    if (order.video_IA_order.length > 0) {
        video_to_play = order.video_IA_order.shift()
    } else if (order.video_IB_order.length > 0) {
        video_to_play = order.video_IB_order.shift()
    }
    if (video_to_play) {
        let html_video = document.getElementById("video_extrait_display")
        console.log("video extrait :", video_to_play)
        html_video.src = `videos/${video_to_play}_extract.mp4`
        html_video.load()
        document.getElementById("video_extrait").style.display = "block"
    } else {
        load_talon()
    }
}

function load_video_full() {
    let chosen_q = retrieve_data()
    hide_everything()
    video_to_play = `${video_to_play.substring(0, 3) + convert_video_to_play_to_digit(chosen_q)}`
    if (video_to_play) {
        let html_video = document.getElementById("video_full_display")
        html_video.src = `videos/${video_to_play}.mp4`
        html_video.load()
        document.getElementById("video_full").style.display = "block"
    } else {
        load_talon()
    }
}

function load_qoe() {
    hide_everything()
    document.getElementById("qoe").style.display = 'block'
}

function load_interface() {
    let interface_to_display
    if (order.video_IA_order.length > 0 || (order.video_IA_order.length === 0 && order.video_IB_order.length === 5)) {
        interface_to_display = order.interface[0]
    } else {
        interface_to_display = order.interface[1]
    }
    let played_quality = video_to_play.substr(video_to_play.length - 1, 1)
    hide_everything()
    switch (interface_to_display) {
        case 1:
            switch (played_quality) {
                case '1':
                    document.getElementById("1080_pur").checked = true
                    break;
                case '2':
                    document.getElementById("720_pur").checked = true
                    break;
                case '3':
                    document.getElementById("576_pur").checked = true
                    break;
                default:
                    break;
            }
            document.getElementById("choix_pur").style.display = 'block';
            break;
        case 2:
            switch (played_quality) {
                case '1':
                    document.getElementById("1080_ecolo").checked = true
                    break;
                case '2':
                    document.getElementById("720_ecolo").checked = true
                    break;
                case '3':
                    document.getElementById("576_ecolo").checked = true
                    break;
                default:
                    break;
            }
            document.getElementById("choix_ecolo").style.display = 'block';
            break;

        default:
            break;
    }
}

function convert_video_to_play_to_digit(video_to_play) {
    switch (video_to_play) {
        case "1080_pur":
        case "1080_ecolo":
            return 1
        case "720_pur":
        case "720_ecolo":
            return 2
        case "576_pur":
        case "576_ecolo":
            return 3;
        default:
            break;
    }

}

function load_consignes() {
    hide_everything()
    document.getElementById("consignes").style.display = "block"
}

function load_talon() {
    hide_everything()
    document.getElementById("talon_socio").style.display = "block"
}

function retrieve_data() {
    let res = document.querySelector('input[name="quali"]:checked').value;
    donnees.choix.push(res)
    document.querySelectorAll('input[name="quali"]').forEach(input => input.checked = false)
    return res
}

function load_interstice() {
    hide_everything()

    if (order.video_IA_order.length === 0 && order.video_IB_order.length === 5) {
        document.getElementById("pause").style.display = "block"
        start_timer()
    } else if (order.video_IA_order.length > 0 || order.video_IB_order.length > 0) {
        document.querySelectorAll("#interstice h1")[0].innerHTML = ("Vidéo " + (videos.length + 1 - (order.video_IA_order.length + order.video_IB_order.length)) + " sur " + videos.length)
        document.getElementById("interstice").style.display = "block"
    } else {
        load_talon()
    }
}

function suivant_qoe() {
    let res = document.querySelector('input[name="qoe"]:checked').value;
    donnees.qoe.push(res)
    document.querySelectorAll('input[name="qoe"]').forEach(input => input.checked = false)
    load_interstice()
}

function start_timer() {
    const departMinutes = 5 //plutôt 5 à 10 minutes
    let temps = departMinutes * 60

    const timerElement = document.getElementById("timer")
    setInterval(() => {
        let minutes = parseInt(temps / 60, 10)
        let secondes = parseInt(temps % 60, 10)

        minutes = minutes < 10 ? "0" + minutes : minutes
        secondes = secondes < 10 ? "0" + secondes : secondes

        timerElement.innerText = `${minutes}:${secondes}`
        temps = temps <= 0 ? 0 : temps - 1
    }, 1000)

    setTimeout(() => {
        document.getElementById("suivant_pause").disabled = false
    }, temps * 1000 + 1000)

}
function hide_everything() {
    let sections = document.querySelectorAll("section")
    sections.forEach(section => section.style.display = "none")
}

async function send(data) {
    //chopper infos questionnaire d'abord
    donnees.birth = document.getElementById("birth").value
    donnees.genre = document.getElementById("genre").value
    donnees.connaissances_video = document.querySelector('input[name="connaissances_video"]:checked').value
    donnees.numerique_environnement = document.querySelector('input[name="num_envt"]:checked').value
    donnees.ins = document.getElementById("ins").value
    console.log(donnees)
    await putToAPI("http://localhost:3000/save_data", data)
    hide_everything()
    document.querySelector("body").innerHTML = "<h1>L'expérimentation est terminée, merci !</h1>"
}

async function putToAPI(url, json_data) {
    let data;

    let myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    const reponse = await fetch(url, {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(json_data)
    });
    if (reponse.ok) {
        data = await reponse.json()
        console.log(data);
    } else {
        console.log("erreur", reponse.status, reponse.statusText);
    }
    return data;
}

async function getFromAPI(url) {
    let data;
    const reponse = await fetch(url);
    if (reponse.ok) {
        data = await reponse.json()
        console.log(data);
    } else {
        console.log("erreur", reponse.status, reponse.statusText);
    }
    return data;
}

async function run() {
    donnees.user_id = await generate_user_id()
    randomize(donnees.user_id)
    console.log(order)
    hide_everything()
    load_consignes()
}

document.getElementById("suivant_consignes").addEventListener('click', () => load_interstice());
document.getElementById("suivant_video_extrait").addEventListener('click', () => load_interface())
document.getElementById("suivant_video_full").addEventListener('click', () => load_qoe())
document.getElementById("suivant_interstice").addEventListener('click', () => load_video_extract())
document.getElementById("fin_questionnaire").addEventListener('click', () => send(donnees))
document.getElementById("suivant_qualite_ecolo").addEventListener('click', () => load_video_full())
document.getElementById("suivant_qualite_pure").addEventListener('click', () => load_video_full())
document.getElementById("suivant_pause").addEventListener('click', () => load_video_extract())
document.getElementById("suivant_jugement_qualite").addEventListener('click', () => suivant_qoe())

run()
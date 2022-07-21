document.addEventListener("DOMContentLoaded", ()=>{

    getQuotes()
    let form = document.getElementById("new-quote-form")
    form.addEventListener("submit", (event)=>{
        event.preventDefault()
        handleSubmit()
    })


})

function handleSubmit(){
    let quote = {}
    quote.quote = document.querySelector("input[name=quote]").value
    quote.author = document.querySelector("input[name=author]").value
    quote.likes = []
    postQuote(quote)

}

function getQuotes(){
    fetch("http://localhost:3000/quotes?_embed=likes")
    .then(res=> res.json())
    .then(quotes => iterateQuotes(quotes))
}


function iterateQuotes(quotes){
    quotes.forEach(quote => appendQuote(quote))
}


function appendQuote(quote){
    let quoteList = document.getElementById("quote-list")
    let quoteCard = document.createElement("li")
    let blockquote = document.createElement("blockquote")
    let p = document.createElement("p")
    let footer = document.createElement("footer")
    let br = document.createElement("br")
    let successBtn = document.createElement("button")
    let span = document.createElement("span")
    let dangerBtn = document.createElement("button")

    quoteCard.className = "quote-card"
    blockquote.className = "blockquote"
    p.className = "mb-0"
    footer.className = "blockquote-footer"
    successBtn.className = "btn-success"
    dangerBtn.className = "btn-danger"
    quoteCard.id = quote.id

    p.textContent = quote.quote
    footer.textContent = quote.author
    successBtn.textContent= "Likes:"
    successBtn.addEventListener("click", (event)=>{
        likeQuote(event)
    })
    span.textContent = quote.likes.length
    dangerBtn.textContent = "Delete"
    dangerBtn.addEventListener("click", (event)=> {
        deleteCard(event)
    })


    successBtn.append(span)
    blockquote.append(p, footer, br, successBtn, dangerBtn)
    quoteCard.append(blockquote)
    quoteList.append(quoteCard)
}

function postQuote(quote){
    fetch('http://localhost:3000/quotes', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: (JSON.stringify(quote)),
    })
    .then(res=> res.json())
    .then(quote => appendQuote(quote))
}


function deleteCard(event){ 
   let quoteCard = event.target.parentElement.parentElement
   fetch(`http://localhost:3000/quotes/${quoteCard.id}`,{
    method: "DELETE",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
})
.then(res=> res.json)
.then(response=> console.log(response))
   quoteCard.remove()
}


function likeQuote(event){
    let quoteCardId = event.target.parentElement.parentElement.id
    let idInt = parseInt(quoteCardId)
    fetch(`http://localhost:3000/likes/`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Accept": "application/json",
        },
        body: (JSON.stringify(
            {quoteId: idInt,
            createdAt: Date.now()}
        ))
    })
    .then(res=> res.json())
    .then(like=> console.log(like))

    let likeCountSpan = event.target.childNodes[1]
    let likeCount = parseInt(likeCountSpan.innerHTML)
    likeCountSpan.textContent = likeCount + 1

}


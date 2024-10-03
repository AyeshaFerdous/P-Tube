const getTimeStrings =(time) => {
    const hour = parseInt(time /3600);
    let remainingSecond = time % 3600;
    const minute = parseInt(remainingSecond / 60);
    remainingSecond = remainingSecond % 60;
    return `${hour} hour ${minute} minute ${remainingSecond} second ago`;
}
const removeActiveButton = () => {
  const buttons = document.getElementsByClassName("category-btn");
  for(let btn of buttons){
    btn.classList.remove("active");
  }
}
const loadCategories = () =>{
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error))
}

const loadVideos = (searchText = "") =>{
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.log(error))
}

const loadDetails = async (videoId) =>{
  const uri =`https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
  const res = await fetch(uri)
  const data = await res.json()
  displayDetails(data.video)
}

const displayDetails =(video)=>{
  const detailsContainer = document.getElementById('modal-content');
  detailsContainer.innerHTML = `
  <img src="${video.thumbnail}"/>
  <p>${video.description}</p>
  `;
  document.getElementById("showModalData").click();
}
const loadCategoriesVideos = (id) =>{

   removeActiveButton();

  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
  .then((res) => res.json())
  .then((data) =>{
    const activeBtn = document.getElementById(`btn-${id}`);
    activeBtn.classList.add("active");
    displayVideos(data.category)
  })
  .catch((error) => console.log(error))
}
const displayVideos =(videos) =>{
     const videosContainer = document.getElementById('videos');
     videosContainer.innerHTML = "";

     if(videos.length == 0){
        videosContainer.classList.remove("grid");
        videosContainer.innerHTML = `
        <div class = "min-h-[300px] flex flex-col gap-5 justify-center items-center">
        <img src ="Icon.png">
        <h2 class="text-center text-xl font-bold">No Content Here In This Category</h2>
        </div>
        `
        return;
     }else{
        videosContainer.classList.add("grid")
     }

    videos.forEach((video) =>{
      const card = document.createElement('div');
      card.classList = "card card-compact";
      card.innerHTML = `
       <figure class = "h-[200px] relative">
         <img src=${video.thumbnail} class="h-full w-full object-cover"
         alt="Shoes" />

         ${video.others.posted_date ?. length == 0 ? "" : `<span class="absolute text-xs right-2 bottom-2 bg-black text-white rounded p-1">
            ${getTimeStrings(video.others.posted_date)}
            </span>`}
         
     </figure>
     <div class="px-0 py-2 flex gap-2">
       <div>
       <img class="w-10 h-10 rounded-full object-cover" src = ${video.authors[0].profile_picture}>
       </div>
       <div>
       <h2 class="font-bold text-xl">${video.title}</h2>
       <div class="flex items-center gap-2">
          <p class="text-gray-400">${video.authors[0].profile_name}</p>
         
          ${
            video.authors[0].verified == true ? '<img class="w-5" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png">' : ""}
       
       </div>
       <p><button onclick="loadDetails('${video.video_id}')" class ="btn btn-sm btn-error">details</button></p>
       </div>
     </div>
      
      `;
      videosContainer.append(card);
    })
}
const displayCategories =(categories) => {
    const categoryContainer = document.getElementById('category')


  categories.forEach((item) => {
    

    const buttonContainer = document.createElement('div');
    buttonContainer.innerHTML = `
    <button id="btn-${item.category_id}" onclick="loadCategoriesVideos(${item.category_id})" class="btn category-btn">
    ${item.category}
    </button>
    `;
    categoryContainer.append(buttonContainer)
  });
}
document.getElementById("search").addEventListener("keyup", (e) => {
  loadVideos(e.target.value);
})
loadCategories();
loadVideos();
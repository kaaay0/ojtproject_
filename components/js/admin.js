var newMemberAddBtn = document.querySelector('.addMemberBtn'),
darkBg = document.querySelector('.dark_bg'),
popupForm = document.querySelector('.popup'),
crossBtn = document.querySelector('.closeBtn'),
submitBtn = document.querySelector('.submitBtn'),
 modalTitle = document.querySelector('.modalTitle'),
 popupFooter = document.querySelector('.popupFooter'),
 imgInput = document.querySelector('.img'),
 imgHolder = document.querySelector('.imgholder')
 form = document.querySelector('form'),
 formInputFields = document.querySelectorAll('form input'),
  uploadimg = document.querySelector("#uploadimg"),
  fName = document.getElementById("fName"),
  mName = document.getElementById("mName")
  lName = document.getElementById("lName"),
  uName = document.getElementById("uName"),
  rank = document.getElementById("rank"),
  userType = document.getElementById("userType"),
  unit = document.getElementById("unit"),
  sDate = document.getElementById("sDate"),
  email = document.getElementById("email"),
  phone = document.getElementById("phone"),
  entries = document.querySelector(".showEntries"),
  tabSize = document.getElementById("table_size"),
  userInfo = document.querySelector(".userInfo"),
  table = document.querySelector("table"),
  filterData = document.getElementById("search")

let originalData = localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')) : []
let getData = [...originalData]


let isEdit = false, editId

var arrayLength = 0
var tableSize = 10
var startIndex = 1
var endIndex = 0
var currentIndex = 1
var maxIndex = 0

showInfo()


newMemberAddBtn.addEventListener('click', ()=> {
    isEdit = false
    submitBtn.innerHTML = "Submit"
    modalTitle.innerHTML = "Fill the Form"
    popupFooter.style.display = "block"
    imgInput.src = "../src/img/Profile Icon.webp"
    darkBg.classList.add('active')
    popupForm.classList.add('active')
})

crossBtn.addEventListener('click', ()=>{
    darkBg.classList.remove('active')
    popupForm.classList.remove('active')
    form.reset()
})

uploadimg.onchange = function(){
    if(uploadimg.files[0].size < 1000000){   // 1MB = 1000000
        var fileReader = new FileReader()

        fileReader.onload = function(e){
            var imgUrl = e.target.result
            imgInput.src = imgUrl
        }

        fileReader.readAsDataURL(uploadimg.files[0])
    }

    else{
        alert("This file is too large!")
    }

}

function preLoadCalculations(){
    array = getData
    arrayLength = array.length
    maxIndex = arrayLength / tableSize

    if((arrayLength % tableSize) > 0){
        maxIndex++
    }
}



function displayIndexBtn(){
    preLoadCalculations()

    const pagination = document.querySelector('.pagination')

    pagination.innerHTML = ""

    pagination.innerHTML = '<button onclick="prev()" class="prev">Previous</button>'

    for(let i=1; i<=maxIndex; i++){
        pagination.innerHTML += '<button onclick= "paginationBtn('+i+')" index="'+i+'">'+i+'</button>'
    }

    pagination.innerHTML += '<button onclick="next()" class="next">Next</button>'

    highlightIndexBtn()
}

function paginationBtn(i){
    currentIndex = i

    var prevBtn = document.querySelector('.prev')
    var nextBtn = document.querySelector('.next')

    highlightIndexBtn()

    if(currentIndex > maxIndex - 1){
        nextBtn.classList.remove('act')
    }
    else{
        nextBtn.classList.add("act")
    }


    if(currentIndex > 1){
        prevBtn.classList.add("act")
    }

    if(currentIndex < 2){
        prevBtn.classList.remove("act")
    }
}

function highlightIndexBtn(){
    startIndex = ((currentIndex - 1) * tableSize) + 1
    endIndex = (startIndex + tableSize) - 1

    if(endIndex > arrayLength){
        endIndex = arrayLength
    }

    if(maxIndex >= 2){
        var nextBtn = document.querySelector(".next")
        nextBtn.classList.add("act")
    }


    entries.textContent = `Showing ${startIndex} to ${endIndex} of ${arrayLength} entries`

    var paginationBtns = document.querySelectorAll('.pagination button')
    paginationBtns.forEach(btn => {
        btn.classList.remove('active')
        if(btn.getAttribute('index') === currentIndex.toString()){
            btn.classList.add('active')
        }
    })


    showInfo()
}




function showInfo(){
    document.querySelectorAll(".employeeDetails").forEach(info => info.remove())

    var tab_start = startIndex - 1
    var tab_end = endIndex

    if(getData.length > 0){
        for(var i=tab_start; i<tab_end; i++){
            var staff = getData[i]


            if(staff){
                let createElement = `<tr class = "employeeDetails">
                <td>${i+1}</td>
                <td><img src="${staff.picture}" alt="" width="40" height="40"></td>
                <td>${staff.fName + " " + staff.mName + " " + staff.lName}</td>
                <td>${staff.uName}</td>
                <td>${staff.rankVal}</td>
                <td>${staff.userTypeVal}</td>
                <td>${staff.unitVal}</td>
                <td>${staff.sDateVal}</td>
                <td>${staff.emailVal}</td>
                <td>${staff.phoneVal}</td>
                <td>
                    <button onclick="readInfo('${staff.picture}', '${staff.fName}', '${staff.mName}', '${staff.lName}', '${staff.uName}','${staff.rankVal}', '${staff.userTypeVal}', '${staff.unitVal}', '${staff.sDateVal}', '${staff.emailVal}', '${staff.phoneVal}')"><i class="fa-regular fa-eye"></i></button>

                    <button onclick="editInfo('${i}', '${staff.picture}', '${staff.fName}', '${staff.mName}', '${staff.lName}', '${staff.uName}', '${staff.rankVal}', '${staff.userTypeVal}', '${staff.unitVal}', '${staff.sDateVal}', '${staff.emailVal}', '${staff.phoneVal}')"><i class="fa-regular fa-pen-to-square"></i></button>


                    <button onclick = "deleteInfo(${i})"><i class="fa-regular fa-trash-can"></i></button>
                </td>
            </tr>`

                userInfo.innerHTML += createElement
                table.style.minWidth = "1450px"
            }
        }
    }


    else{
        userInfo.innerHTML = `<tr class="employeeDetails"><td class="empty" colspan="11" align="center">No data available in table</td></tr>`
        table.style.minWidth = "1400px"
    }
}

showInfo()


function readInfo(pic, fname, mname, lname, uname, Rank, UserType, Unit, SDate, Email, Phone){
    imgInput.src = pic
    fName.value = fname
    mName.value = mname
    lName.value = lname
    uName.value = uname
    rank.value = Rank
    userType.value = UserType
    unit.value = Unit
    sDate.value = SDate
    email.value = Email
    phone.value = Phone

    darkBg.classList.add('active')
    popupForm.classList.add('active')
    popupFooter.style.display = "none"
    modalTitle.innerHTML = "Profile"
    formInputFields.forEach(input => {
        input.disabled = true
    })


    imgHolder.style.pointerEvents = "none"
}

function editInfo(id, pic, fname, mname, lname, uname, Rank, UserType, Unit, SDate, Email, Phone){
    isEdit = true
    editId = id

    const originalIndex = originalData.findIndex(item => item.id === id)

    originalData[originalIndex] = {
        id: id,
        picture: pic,
        fName: fname,
        mName: mname,
        lName: lname,
        uName: uname,
        rankVal: Rank,
        userTypeVal: UserType,
        unitVal: Unit,
        sDateVal: SDate,
        emailVal: Email,
        phoneVal: Phone
    }

    imgInput.src = pic
    fName.value = fname
    mName.value = mname
    lName.value = lname
    uName.value = uname
    rank.value = Rank
    userType.value = UserType
    unit.value = Unit
    sDate.value = SDate
    email.value = Email
    phone.value = Phone


    darkBg.classList.add('active')
    popupForm.classList.add('active')
    popupFooter.style.display = "block"
    modalTitle.innerHTML = "Update the Form"
    submitBtn.innerHTML = "Update"
    formInputFields.forEach(input => {
        input.disabled = false
    })


    imgHolder.style.pointerEvents = "auto"
}

function deleteInfo(index){
    if(confirm("Aer you sure want to delete?")){
        originalData.splice(index, 1);
        localStorage.setItem("userProfile", JSON.stringify(originalData));
        
        getData = [...originalData];

        preLoadCalculations()

        if(getData.length === 0){
            currentIndex = 1
            startIndex = 1
            endIndex = 0
        }
        else if(currentIndex > maxIndex){
            currentIndex = maxIndex
        }

        showInfo()
        highlightIndexBtn()
        displayIndexBtn()

        var nextBtn = document.querySelector('.next')
        var prevBtn = document.querySelector('.prev')

        if(Math.floor(maxIndex) > currentIndex){
            nextBtn.classList.add("act")
        }
        else{
            nextBtn.classList.remove("act")
        }


        if(currentIndex > 1){
            prevBtn.classList.add('act')
        }
    }
}


form.addEventListener('submit', (e)=> {
    e.preventDefault()

    const information = {
        id: Date.now(),
        picture: imgInput.src == undefined ? "../src/img/Profile Icon.webp" :imgInput.src,
        fName: fName.value,
        mName: mName.value,
        lName: lName.value,
        uName: uName.value,
        rankVal: rank.value,
        userTypeVal: userType.value,
        unitVal: unit.value,
        sDateVal: sDate.value,
        emailVal: email.value,
        phoneVal: phone.value
    }

    if(!isEdit){
        originalData.unshift(information)
    }
    else{
        originalData[editId] = information
    }
    getData = [...originalData]
    localStorage.setItem('userProfile', JSON.stringify(originalData))

    submitBtn.innerHTML = "Submit"
    modalTitle.innerHTML = "Fill the Form"

    darkBg.classList.remove('active')
    popupForm.classList.remove('active')
    form.reset()


    highlightIndexBtn()
    displayIndexBtn()
    showInfo()

    var nextBtn = document.querySelector(".next")
    var prevBtn = document.querySelector(".prev")
    if(Math.floor(maxIndex) > currentIndex){
        nextBtn.classList.add("act")
    }
    else{
        nextBtn.classList.remove("act")
    }


    if(currentIndex > 1){
        prevBtn.classList.add("act")
    }
})


function next(){
    var prevBtn = document.querySelector('.prev')
    var nextBtn = document.querySelector('.next')

    if(currentIndex <= maxIndex - 1){
        currentIndex++
        prevBtn.classList.add("act")

        highlightIndexBtn()
    }

    if(currentIndex > maxIndex - 1){
        nextBtn.classList.remove("act")
    }
}


function prev(){
    var prevBtn = document.querySelector('.prev')

    if(currentIndex > 1){
        currentIndex--
        prevBtn.classList.add("act")
        highlightIndexBtn()
    }

    if(currentIndex < 2){
        prevBtn.classList.remove("act")
    }
}



tabSize.addEventListener('change', ()=>{
    var selectedValue = parseInt(tabSize.value)
    tableSize = selectedValue
    currentIndex = 1
    startIndex = 1
    displayIndexBtn()
})



filterData.addEventListener("input", ()=> {
    const searchTerm = filterData.value.toLowerCase().trim()

    if(searchTerm !== ""){

        const filteredData = originalData.filter((item) => {
            const fullName = (item.fName + " " + item.mName+ " " + item.lName).toLowerCase()
            const userType = item.userTypeVal.toLowerCase()

            return(
                fullName.includes(searchTerm) ||
                userType.includes(searchTerm)
            )
        })
        getData = filteredData
    }

    else{
        getData = JSON.parse(localStorage.getItem('userProfile')) || []
    }


    currentIndex = 1
    startIndex = 1
    displayIndexBtn()
})


displayIndexBtn()

let subMenu = document.getElementById("subMenu");

    function toggleMenu(){
        subMenu.classList.toggle("open-menu")
    }
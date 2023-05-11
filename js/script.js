const $ = document.querySelector.bind(document);
const $All = document.querySelectorAll.bind(document);

const drop_list = $All("form select"),
from_currency = $(".from select"),
to_currency = $(".to select"),
get_button = $("form button");

for (let i = 0; i < drop_list.length; i++) {
    for (let currency_abbr in country_list) {
        let selected = i == 0 ? currency_abbr == "USD" ? "selected" : "" : currency_abbr == "BRL" ? "selected" : "";
        let option_tag = `<option value="${currency_abbr}" ${selected}>${currency_abbr}</option>`;
        drop_list[i].insertAdjacentHTML("beforeend", option_tag);
    }
    drop_list[i].addEventListener("change", e =>{
        swap_flag(e.target);
    });

}

function swap_flag(element) {
    for (let abbr in country_list) {
        if (abbr == element.value){
            let tag_img = element.parentElement.querySelector("img");
            tag_img.src = `https://flagcdn.com/48x36/${country_list[abbr].toLowerCase()}.png`;
        }
    }
}

window.addEventListener("load", ()=>{
    get_conversion_currency();
});

get_button.addEventListener("click", e =>{
    e.preventDefault();
    get_conversion_currency();
});

const change_icon = $("form .icon");
change_icon.addEventListener("click", ()=>{
    let temp_from = from_currency.value;
    from_currency.value = to_currency.value;
    to_currency.value = temp_from; 
    swap_flag(from_currency);
    swap_flag(to_currency); 
    get_conversion_currency(); 
})

function get_conversion_currency() {
    const amount = $("form input");
    const conversion_text = $("form .conversion-text");
    let amount_value = amount.value;
    if (amount_value == "" || amount_value == "0") {
        amount = "1";
        amount_value = 1;
    }
    conversion_text.innerText = "Obtendo a taxa de câmbio...";
    let url = `https://v6.exchangerate-api.com/v6/SUA_CHAVE_API/latest/${from_currency.value}`;
    fetch(url).then(response => response.json()).then(result =>{
        let conversion_currency = result.conversion_rates[to_currency.value];
        let total_currency = (amount_value * conversion_currency).toFixed(2); 
        conversion_text.innerText = `${amount_value} ${from_currency.value} = ${total_currency} ${to_currency.value}`;
    }).catch(() =>{
        exchangeRateTxt.innerText = "Algo deu errado.";
    });
}
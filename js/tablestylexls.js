const toxls = (elements) => {
    try{
        const table = document.getElementById(elements.table);

        const thead = document.createElement("thead");
        
        const tr = document.createElement("tr");
        for(let j in elements.header_cols){
            const head = elements.header_cols[j];
            const td = document.createElement("th");
            td.style = "width:"+head.width+";";
            td.className = "text-center";
            td.innerHTML = head.name;
            tr.appendChild(td);
        }

        if(typeof elements.btns === "object" && elements.btns != null){
            const td = document.createElement("th");
            td.innerHTML = " ";
            tr.appendChild(td);
        }

        thead.appendChild(tr);
        table.appendChild(thead);
        
        const tbody = document.createElement("tbody");
        let btn_new = false;
        for(let i = 0; i < elements.size; i++){
            const tr = document.createElement("tr");
            let rows = elements.data[i];
            for(let j in elements.header_cols){
                let column = elements.header_cols[j];
                const td = document.createElement("td");
                let valores = "";
                if(typeof rows !== "undefined" && rows !== null){
                    let more_camps = column.item.split(",");
                    more_camps.forEach(element => {
                        if(typeof rows[element.trim()] !== "undefined" && rows[element.trim()] !== null){
                            valores += (valores != "" ? " " : "") + rows[element.trim()];
                        }
                    });
                }

                if(typeof column.type !== "undefined" && column.type !== null){
                    const formattedMoney = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 2 });
                    const formattedNumber = new Intl.NumberFormat('es-MX', { minimumFractionDigits: 0 });
                    
                    switch (column.type) {
                        case 'image':
                            if(valores != ""){
                                const img = document.createElement("img");
                                img.src = elements.app_url + valores;
                                img.width = column.size ?? "48";
                                td.className = "text-center";
                                td.appendChild(img) // = valores;
                            }
                            break;
                        
                        case 'money':
                            td.className = "text-end text-wrap";
                            if(valores != ""){
                                valores = "$" + formattedMoney.format(valores);
                                td.innerHTML = valores;
                            }
                            break;
                        
                        case 'number':
                            td.className = "text-end text-wrap";
                            if(valores != ""){
                                valores = formattedNumber.format(valores);
                                td.innerHTML = valores;
                            }
                            break;

                        default:
                            td.className = "text-wrap";
                            td.innerHTML = valores;
                            break;
                    }
                }else{
                    td.className = "text-wrap";
                    td.innerHTML = valores;
                }
                
                td.id = "td_" +i + "_" + j;
                td.style = "border: 1; border-color: #eee;"
                
                td.addEventListener('click', () => { click_me(i,j); } );
                tr.appendChild(td);
            }

            if(typeof elements.btns === "object" && elements.btns != null){
                const td = document.createElement("td");
                td.id = "btn_" +i ;
                //td.style = "border: 1; border-color: #eee;";
                for(let item in elements.btns){
                    const row = elements.btns[item];
                    const btn = document.createElement("button");
                    btn.type = "button";
                    btn.name = "btn_" + item;
                    btn.className = typeof row.class != "undefined" ? row.class : "";
                    let icon = typeof row.icon != "undefined" ? '<i class="' + row.icon + '"></i>' : "";
                    switch (item) {
                        case "edit":
                            if(typeof rows !== "undefined" && rows != null ){
                                if(typeof rows[row.camp] !== "undefined" && rows[row.camp] != null ){
                                    btn.className = btn.className != "" ? btn.className : "btn btn-primary m-1";
                                    btn.style = "display: normal;";
                                    btn.innerHTML = icon != "" ? icon : '<i class="fa fa-pencil"></i>';
                                    btn.addEventListener('click', () => { dblclick_me(i, elements.header_cols); } );
                                    td.appendChild(btn);
                                }
                            }
                            break;
                        case "update":
                            btn.className = btn.className != "" ? btn.className : "btn btn-success m-1";
                            btn.style = "display: none;";
                            btn.innerHTML = icon != "" ? icon : '<i class="fa-solid fa-floppy-disk"></i>';
                            btn.addEventListener('click', () => { save_me(i, elements.header_cols, row); } );
                            td.appendChild(btn);
                            break;
                        case "new":
                            btn.className = btn.className != "" ? btn.className : "btn btn-primary m-1";
                            btn.innerHTML = icon != "" ? icon : '<i class="fa fa-plus"></i>';
                            btn.style = "display: none;";
                            btn.addEventListener('click', () => { dblclick_me(i, elements.header_cols); } );
                            if(typeof rows === "undefined" && !btn_new){
                                btn.style = "display: normal;";
                                btn_new = true;
                            }
                            td.appendChild(btn);
                            ///if(!btn_new){
                            //}
                            break;
                        case "delete":
                            if(typeof rows !== "undefined" && rows != null ){
                                if(typeof rows[row.camp] !== "undefined" && rows[row.camp] != null ){
                                    btn.className = btn.className != "" ? btn.className : "btn btn-danger m-1";
                                    btn.innerHTML = icon != "" ? icon : '<i class="fa-solid fa-trash-can"></i>';
                                    td.appendChild(btn);
                                }
                            }
                            break;
                        case "other":
                            
                            if(typeof rows !== "undefined" && rows != null ){
                                for(let b in row){
                                    const sub = row[b];
                                    if(typeof rows[sub.camp] !== "undefined" && rows[sub.camp] != null ){
                                        const btn_ = document.createElement("button");
                                        btn_.type = "button";
                                        btn_.name = "btn_" + sub.click;
                                        btn_.className = typeof sub.class != "undefined" ? sub.class : "btn btn-primary m-1";
                                        btn_.style = "display: normal;";
                                        btn_.innerHTML = icon != "" ? icon : '<i class="fa fa-cubes"></i>';
                                        td.appendChild(btn_);
                                    }
                                }
                            }
                            break;
                        default:
                            btn.style = "display: none;";
                            break;
                    }
                    
                    /*";
                    btn.addEventListener("click", () => { })*/
                }
                
                const btn_status = document.createElement("button");
                btn_status.type = "button";
                btn_status.name = "btn_status";
                btn_status.className = "btn btn-success m-1";
                btn_status.style = "display: none;";
                btn_status.disabled = "disabled"
                btn_status.innerHTML = `<span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span> <span role="status">Loading...</span>`;
                btn_status.addEventListener('click', () => {} );
                td.appendChild(btn_status);

                const btn_cancel = document.createElement("button");
                btn_cancel.type = "button";
                btn_cancel.name = "btn_cancel";
                btn_cancel.className = "btn btn-danger m-1";
                btn_cancel.style = "display: none;";
                btn_cancel.innerHTML = '<i class="fa-regular fa-rectangle-xmark"></i>';
                btn_cancel.addEventListener('click', () => { cancel_me(i, elements.header_cols); } );
                td.appendChild(btn_cancel);

                tr.appendChild(td);
            }
            
            tr.addEventListener('dblclick', () => { dblclick_me(i, elements.header_cols); } );
            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
    }catch(err){
        console.log("Error: ",err);
    }
}


const click_me = (c,f) =>{
    const name = "td_" + c + "_" + f;
    const tag = document.getElementById(name);
    
    if(typeof tag === "object" && tag != null){ 
        const inputs = tag.getElementsByTagName("input");
        if(inputs.length === 0){
            let v = tag.innerHTML;
            tag.innerHTML = "";
            const input = document.createElement("input");
            input.value = v;
            input.className = "form-control"
            input.addEventListener('blur', () => { out_me(name); } );
            input.addEventListener('keydown', (event) => { control_me(event,c,f); } );
            tag.appendChild(input);
            input.focus();
        }else{
            console.log("inputs: ", inputs);
        }
    }else{
        console.log("no existe: " + name);
    }
}

const out_me = (name) =>{
    //console.log(tag);
    const tag = document.getElementById(name);
    const inputs = tag.getElementsByTagName("input");
    if(inputs.length > 0){
        let v = inputs[0].value;
        tag.innerHTML = "";
        tag.innerHTML = v;
        //tag.appendChild(input);
    }
}

const control_me = (e,c,f) => {
    var keyValue = e.key;
    var codeValue = e.code;
    //console.log("keyup event, keyValue: " + keyValue);
    //console.log("keyup event, codeValue: " + codeValue);
    let name = "";
    let obj = null;
    switch (codeValue) {
        case 'ArrowRight':
            f++;
            name = "td_" + c + "_" + f;
            obj = document.getElementById(name);
            if(typeof obj === "object" && obj != null){ click_me(name,c,f); }
            break;
        case 'ArrowLeft':
            f--;
            name = "td_" + c + "_" + f;
            obj = document.getElementById(name);
            if(typeof obj === "object" && obj != null){ click_me(name,c,f); }
            break;
        case 'ArrowUp':
            c--;
            name = "td_" + c + "_" + f;
            obj = document.getElementById(name);
            if(typeof obj === "object" && obj != null){ click_me(name,c,f); }
            break;
        case 'ArrowDown':
            c++;
            name = "td_" + c + "_" + f;
            obj = document.getElementById(name);
            if(typeof obj === "object" && obj != null){ click_me(name,c,f); }
            break;
        default:
            break;
    }
    //console.log(name);
}

const btns_status = (index, btns_status) => {
    let btn_name = "btn_" + index ;
    const td_btns = document.getElementById(btn_name);
    let btns_ = [];
    if(typeof td_btns === "object" && td_btns != null){
        const btns = td_btns.getElementsByTagName("button");
        for(let a = 0; a < btns.length; a++){
            const btn = btns[a];
            btns_[btn.name] = btn;
            btn.style = "display: none;";
        }

        //console.log(btns_);
        switch (btns_status) {
            case "save":
                btns_['btn_update'].style = "display: normal;";
                btns_['btn_cancel'].style = "display: normal;";
                break;
            case "edit":
                for(let b in btns_){
                    btns_[b].style = "display: normal;";
                }
                btns_['btn_status'].style = "display: none;";
                btns_['btn_cancel'].style = "display: none;";
                //btns_['btn_delete'].style = "display: none;";
                //btns_['btn_edit'].style = "display: none;";
                btns_['btn_new'].style = "display: none;";
                btns_['btn_update'].style = "display: none;";
                //btns_['btn_edit'].style = "display: none;";
                break;
            case "update":
                btns_['btn_status'].style = "display: normal;";
                break;
            default:
                break;
        }
        
            
    }
}

const dblclick_me = (index, header_cols) => {
    for(let i in header_cols){
        let name = "td_" + index + "_" + i;
        const tag = document.getElementById(name);
        if(typeof tag === "object" && tag != null){ 
            const inputs = tag.getElementsByTagName("input");
            if(inputs.length === 0){
                let v = tag.innerHTML;
                tag.innerHTML = "";
                const input = document.createElement("input");
                input.className = "form-control"
                input.value = v;
                input.addEventListener('blur', () => { out_me(name); } );
                input.addEventListener('keydown', (event) => { control_me(event,c,f); } );
                tag.appendChild(input);
            }
        }else{
            console.log("no existe: " + name);
        }
    }
    
    btns_status(index, "save");
    
}

const save_me = (index, header_cols, btn) => {
    //btns_status(index, "edit");
    console.log(header_cols,btn);
    let valores = [];
    for(let i in header_cols){
        let name = "td_" + index + "_" + i;
        const tag = document.getElementById(name);
        if(typeof tag === "object" && tag != null){ 
            const inputs = tag.getElementsByTagName("input");
            //console.log(inputs);
            if(inputs.length === 0){
                valores[header_cols[i].item] = tag.innerHTML
            }else{
                valores[header_cols[i].item] = inputs[0].value
            }
        }else{
            console.log("no existe: " + name);
        }
    }

    go_rest(valores, btn.type, btn.url)

    console.log(valores);
    
    cancel_me(index,header_cols);
    /*
    */
}

const go_rest = async (data, type, url) =>{
    const result = await fetch(url, {
        method: type,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
    console.log(result);
    
      //.then(data => console.log(data))
      //.catch(error => console.error('Error:', error));
}


const cancel_me = (index, header_cols) => {
    for(let i in header_cols){
        let td = "td_" + index + "_" + i;
        out_me(td);
    }
    
    btns_status(index, "edit");
}
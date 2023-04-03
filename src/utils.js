//export const BASE_URL = 'http://135.125.4.16:5000/api/v_1_8_0'
//export const BASE_URL = 'https://fightclubmc.pythonanywhere.com/api/v_1_6_5'
export const BASE_URL = 'http://127.0.0.1:5000/api/v_1_9_0'



export const fixDate = (date) => {
  let newDate = date.substring(0,10)
  return newDate.split("-")[2] + "/" + newDate.split("-")[1] + "/" + newDate.split("-")[0].substring(2,4)
}

export const isPasswordValid = (password) => {
  return password.length >= 8
  && (password.includes("0")
    || password.includes("1")
    || password.includes("2")
    || password.includes("3")
    || password.includes("4")
    || password.includes("5")
    || password.includes("6")
    || password.includes("7")
    || password.includes("8")
    || password.includes("9")
    )
  && (password.includes("A")
    || password.includes("B")
    || password.includes("C")
    || password.includes("D")
    || password.includes("E")
    || password.includes("F")
    || password.includes("G")
    || password.includes("H")
    || password.includes("I")
    || password.includes("L")
    || password.includes("M")
    || password.includes("N")
    || password.includes("O")
    || password.includes("P")
    || password.includes("Q")
    || password.includes("R")
    || password.includes("S")
    || password.includes("T")
    || password.includes("U")
    || password.includes("V")
    || password.includes("Z")
    || password.includes("W")
    || password.includes("Y")
    || password.includes("J")
    || password.includes("K")
    || password.includes("X")
  )
}
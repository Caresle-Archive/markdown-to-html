window.addEventListener('load', () => {
	const form = document.getElementById('form-markdown')
	const getHTMLButton = document.getElementById('get-html')
	const theme = document.getElementById('theme')
	
	theme.addEventListener('click', () => {
		if (document.body.className.includes('light')) {
			document.body.classList.replace('light', 'dark')
		} else {
			document.body.classList.replace('dark', 'light')
		}
	})
	
	getHTMLButton.addEventListener('click', () => {
		console.log('html button')
	})

	const textHeaderReturn = (split, size, text) => {
		const textContent = text.split(split)[1]
		const textReturn = `<h${size}>${textContent}</h${size}>`
		return textReturn
	}

	const convertHeader = (text) => {
		const regex = new RegExp('#+ ')
		try {
			const found = text.match(regex)[0]
			return textHeaderReturn(found, found.length - 1, text)
		} catch (error) {
			return undefined
		}
	}

	const convertBold = (text) => {
		if (text.startsWith('#')) return undefined
		if (text.startsWith('>')) return undefined
		const textReplaced = text.replaceAll('**', '<!<strong>')
		const newText = textReplaced.split('<!')
		let finalText = ''
		finalText = changeEndTag(newText, finalText, '<strong>', '</strong>')
		if (finalText !== '') {
			finalText = `<p>${finalText}</p>`
		}
		return finalText
	}

	const convertItalic = (arr) => {
		const cleanArr = arr.filter(item => item !== undefined)
		const regex = /\*{1}\w+\*{1}/
		const newArray = cleanArr.map(element => {
			if (element.includes('*')) {
				element = element.replace(regex, (text) => {
					text = text.replace('*', '<em>')
					text = text.replace('*', '</em>')
					return text
				})
			}
			return element
		})
		return newArray
	}

	const changeEndTag = (arr, textToConcat, tagOpen, tagClose) => {
		let number = 0
		arr.forEach(element => {
			if (element.startsWith(tagOpen) && number === 1) {
				element = element.replace(tagOpen, tagClose)
				number = 0
			}
			if (element.startsWith(tagOpen)) {
				number++
			}
			textToConcat += element
		})
		return textToConcat
	}

	const convertBreakLine = (text) => {
		if (text === '') {
			return `<br>`
		}
	}

	const convertBlockquote = (text) => {
		if (text.startsWith('>')) {
			text = text.replace('>', '')
			text = convertBold(text)
			return `<blockquote>${text}</blockquote>`
		}
	}

	const convertOrderedList = (arr, text) => {
		const regex = /[0-9]+\./
		if (text.match(regex)) {
			const newText = text.split(regex)[1]
			const indToPop = []
			arr.map((val, ind) => {
				if (val !== undefined) {
					if (val.match(regex) && (!val.search(/<h[0-9]>/) === false)) {
						indToPop.push(ind)
					}
				}
			})
			indToPop.forEach(element => {
				arr.splice(element, 1)
			})
			return `<li>${newText}</li>`
		}
	}

	const convertOrderedList2 = (arr) => {
		let index = []
		let indexBeginList = []
		let indexZero = 0
		let lastInd = 0
		let addIndexZero = false
		arr.forEach((element, ind) => {
			if (element.startsWith('<li>')) {
				index.push(ind)
			}
		})

		// Index to create the begin of the list
		index.forEach((val, ind) => {
			if (ind === 0) {
				return
			}
			if (index[lastInd] + 1 !== val) {
				indexBeginList.push(val)
			}
			lastInd = ind
		})

		index.forEach((val, ind) => {
			if (ind === 0 || ind === indexZero) {
				arr[val] = `<ol>${arr[val]}`
				return
			}

			indexBeginList.forEach((element) => {
				if (element === index[ind + 1]) {
					arr[val] = `${arr[val]}</ol>`
					addIndexZero = true
				}
			})
			arr[index[indexZero]] += arr[val]

			if (addIndexZero) {
				indexZero = ind + 1
				addIndexZero = false
			}
		})
		
		for(let i = index.length - 1; i >= 1; i--) {
			let skipSplice = false
			indexBeginList.forEach(e => {
				if (index[i] === e) {
					skipSplice = true
				}
			})
			if (skipSplice) {
				skipSplice = false
				continue
			} else {
				arr.splice(index[i], 1)
			}
		}
	}

	const convertUnorderedList = (arr, text) => {
		const regex = /\-+ /
		if (text.match(regex)) {
			const newText = text.split(regex)[1]
			const indToPop = []
			arr.map((val, ind) => {
				if (val !== undefined) {
					if (val.match(regex) && (!val.search(/<h[0-9]>/) === false)) {
						indToPop.push(ind)
					}
				}
			})
			indToPop.forEach(element => {
				arr.splice(element, 1)
			})
			return `<uli>${newText}</li>`
		}
	}

	const convertUnorderedList2 = (arr) => {
		let index = []
		let indexBeginList = []
		let indexZero = 0
		let lastInd = 0
		let addIndexZero = false
		arr.forEach((element, ind) => {
			if (element.startsWith('<uli>')) {
				index.push(ind)
			}
		})

		index.forEach((val, ind) => {
			if (ind === 0) {
				return
			}
			if (index[lastInd] + 1 !== val) {
				indexBeginList.push(val)
			}
			lastInd = ind
		})

		index.forEach((val, ind) => {
			if (arr[val].startsWith('<uli>')) {
				arr[val] = arr[val].replace('<uli>', '<li>')
			}

			if (ind === 0 || ind === indexZero) {
				arr[val] = `<ul>${arr[val]}`
				return
			}

			indexBeginList.forEach((element) => {
				if (element === index[ind + 1]) {
					arr[val] = `${arr[val]}</ul>`
					addIndexZero = true
				}
			})
			arr[index[indexZero]] += arr[val]

			if (addIndexZero) {
				indexZero = ind + 1
				addIndexZero = false
			}
		})
		
		for(let i = index.length - 1; i >= 1; i--) {
			let skipSplice = false
			indexBeginList.forEach(e => {
				if (index[i] === e) {
					skipSplice = true
				}
			})
			if (skipSplice) {
				skipSplice = false
				continue
			} else {
				arr.splice(index[i], 1)
			}
		}
	}

	const convert = (arr, textConvert) => {
		arr.push(convertHeader(textConvert))
		arr.push(convertBold(textConvert))
		arr.push(convertBreakLine(textConvert))
		arr.push(convertBlockquote(textConvert))
		arr.push(convertOrderedList(arr, textConvert))
		arr.push(convertUnorderedList(arr, textConvert))
	}

	const formCheck = (e) => {
		e.preventDefault()
		const dataPreview = document.getElementById('data-preview')
		let values = []
		form.childNodes.forEach(child => {
			if (child.tagName === 'TEXTAREA') {
				values = child.value.split('\n')
			}
		})
		let textToAdd = []
		values.forEach((value) => {
			convert(textToAdd, value)
		})
		textToAdd = textToAdd.filter(text => text !== undefined)
		convertOrderedList2(textToAdd)
		convertUnorderedList2(textToAdd)
		textToAdd = convertItalic(textToAdd)
		dataPreview.innerHTML = ''
		textToAdd.forEach(text => {
			dataPreview.innerHTML += text
		})
	}
	form.addEventListener('submit', formCheck)
	
	
})

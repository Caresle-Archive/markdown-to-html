window.addEventListener('load', () => {
	const form = document.getElementById('form-markdown')
	
	const textHeaderReturn = (split, size, text) => {
		const textContent = text.split(split)[1]
		const textReturn = `<h${size}>${textContent}</h${size}>`
		return textReturn
	}

	const convertHeader = (text) => {
		const regexp = new RegExp('#+ ')
		try {
			const found = text.match(regexp)[0]
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
		let strong = 0
		newText.forEach(element => {
			if (element.startsWith('<strong>') && strong === 1) {
				element = element.replace('<strong>', '</strong>')
				strong = 0
			}
			if (element.startsWith('<strong>')) {
				strong++
			}
			finalText += element
		})
		return finalText
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
		const regexp = /[0-9]./
		if (text.match(regexp)) {
			const newText = text.split(regexp)[1]
			const indToPop = []
			arr.map((val, ind) => {
				if (val !== undefined) {
					if (val.match(regexp) && !val.search(/<h[0-9]>/) === false) {
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
		arr.forEach((element, ind) => {
			if (element.startsWith('<li>')) {
				index.push(ind)
			}
		})
		index.forEach((val, ind) => {
			if (ind === 0) {
				arr[val] = `<ol>${arr[val]}`
				return
			}
			if (ind === index.length - 1) {
				arr[val] = `${arr[val]}</ol>`
			}
			arr[index[0]] += arr[val]
		})
		for(let i = index.length - 1; i >= 1; i--) {
			arr.splice(index[i], 1)
		}
	}

	const convert = (arr, textConvert) => {
		arr.push(convertHeader(textConvert))
		arr.push(convertBold(textConvert))
		arr.push(convertBreakLine(textConvert))
		arr.push(convertBlockquote(textConvert))
		arr.push(convertOrderedList(arr, textConvert))
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
		dataPreview.innerHTML = ''
		textToAdd.forEach(text => {
			dataPreview.innerHTML += text
		})
	}
	form.addEventListener('submit', formCheck)
	
	
})

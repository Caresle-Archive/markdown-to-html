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
		values.forEach(value => {
			textToAdd.push(convertHeader(value))
			textToAdd.push(convertBold(value))
		})
		textToAdd = textToAdd.filter(text => text !== undefined)
		dataPreview.innerHTML = ''
		textToAdd.forEach(text => {
			dataPreview.innerHTML += text
		})
	}

	form.addEventListener('submit', formCheck)
	
	
})

window.addEventListener('load', () => {
	const form = document.getElementById('form-markdown')
	
	const textHeaderReturn = (split, size, text) => {
		const textContent = text.split(split)[1]
		const textReturn = `<h${size}>${textContent}</h${size}>`
		return textReturn
	}

	const convertHeader = (text) => {
		const regexp = new RegExp('#+ ')
		const found = text.match(regexp)[0]
		return textHeaderReturn(found, found.length - 1, text)
	}

	const convertBold = (text) => {
		console.log(`convert Bold ${text}`)
		if (text.startsWith('**') && text.endsWith('**')) {
			console.log(text.replace('**', '').split('**'))
			const textContent = text.split('**')[1]
			return `<p>
				<strong>${textContent}</strong>
				</p>`
		}
		if (text.startsWith('**')) {
			const newText = text.replace('**', '').split('**')
			return `<p>
				<strong>${newText[0]}</strong> ${newText[1]}
				</p>`
		} 
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
			console.log('1')
			textToAdd.push(convertHeader(value))
			// textToAdd.push(convertBold(value))
		})
		console.log(textToAdd)
		textToAdd = textToAdd.filter(text => text !== undefined)
		dataPreview.innerHTML = ''
		textToAdd.forEach(text => {
			dataPreview.innerHTML += text
		})
	}

	

	form.addEventListener('submit', formCheck)
	
	
})

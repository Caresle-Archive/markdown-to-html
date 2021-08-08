window.addEventListener('load', () => {
	const form = document.getElementById('form-markdown')
	
	const textHeaderReturn = (split, size, text) => {
		const textContent = text.split(split)[1]
		const textReturn = `<h${size}>${textContent}</h${size}>`
		return textReturn
	}

	const convertHeader = (text) => {
		if (text.startsWith('#')) {
			if (text.startsWith('##')) {
				if (text.startsWith('###')) {
					if (text.startsWith('####')) {
						if (text.startsWith('#####')) {
							if (text.startsWith('######')) {
								return textHeaderReturn('###### ', 6, text)
							}
							return textHeaderReturn('##### ', 5, text)
						}
						return textHeaderReturn('#### ', 4 , text)
					}
					return textHeaderReturn('### ', 3, text)
				}
				return textHeaderReturn('## ', 2, text)
			}
			
			return textHeaderReturn('# ', 1, text)
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
			textToAdd.push(convertHeader(value))
		})
		textToAdd = textToAdd.filter(text => text !== undefined)
		dataPreview.innerHTML = ''
		textToAdd.forEach(text => {
			dataPreview.innerHTML += text
		})
	}

	

	form.addEventListener('submit', formCheck)
	
	
})

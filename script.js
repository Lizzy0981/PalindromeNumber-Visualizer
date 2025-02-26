document.addEventListener('DOMContentLoaded', function() {
    // Actualizar el año en el footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Elementos del DOM
    const inputForm = document.getElementById('input-form');
    const numberInput = document.getElementById('number-input');
    const resultMessage = document.getElementById('result-message');
    const originalNumber = document.getElementById('original-number');
    const reversedNumber = document.getElementById('reversed-number');
    const processSteps = document.getElementById('process-steps');
    const comparisonDetails = document.getElementById('comparison-details');
    const comparisonContainer = document.getElementById('comparison-container');
    const resetBtn = document.getElementById('reset-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const autoBtn = document.getElementById('auto-btn');
    const pills = document.querySelectorAll('.pill');
    
    // Variables para la animación
    let animationSteps = [];
    let currentStep = -1;
    let autoPlayInterval = null;
    
    // Eventos para las píldoras de ejemplo
    pills.forEach(pill => {
        pill.addEventListener('click', function() {
            numberInput.value = this.getAttribute('data-number');
        });
    });
    
    // Evento para el formulario
    inputForm.addEventListener('submit', function(e) {
        e.preventDefault();
        startVisualization();
    });
    
    // Evento para reiniciar
    resetBtn.addEventListener('click', function() {
        resetVisualization();
    });
    
    // Evento para el paso anterior
    prevBtn.addEventListener('click', function() {
        showPrevStep();
    });
    
    // Evento para el siguiente paso
    nextBtn.addEventListener('click', function() {
        showNextStep();
    });
    
    // Evento para reproducción automática
    autoBtn.addEventListener('click', function() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            autoBtn.innerHTML = '<span class="btn-icon">▶️</span><span>Auto</span>';
        } else {
            autoBtn.innerHTML = '<span class="btn-icon">⏹</span><span>Detener</span>';
            autoPlayInterval = setInterval(showNextStep, 1200);
        }
    });
    
    // Función para iniciar la visualización
    function startVisualization() {
        // Detener animación anterior si existe
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            autoBtn.innerHTML = '<span class="btn-icon">▶️</span><span>Auto</span>';
        }
        
        // Obtener y validar input
        const num = parseInt(numberInput.value.trim());
        
        if (isNaN(num)) {
            resultMessage.textContent = 'Por favor, ingresa un número entero válido.';
            resultMessage.style.color = 'var(--error)';
            return;
        }
        
        // Validar que esté dentro del rango permitido
        const MIN_VALUE = Math.pow(-2, 31);
        const MAX_VALUE = Math.pow(2, 31) - 1;
        
        if (num < MIN_VALUE || num > MAX_VALUE) {
            resultMessage.textContent = `El número debe estar en el rango de ${MIN_VALUE} a ${MAX_VALUE}.`;
            resultMessage.style.color = 'var(--error)';
            return;
        }
        
        // Reiniciar visualización
        resetVisualization();
        
        // Mostrar número original
        originalNumber.textContent = num;
        
        // Generar pasos de animación
        generateAnimationSteps(num);
        
        // Activar controles
        nextBtn.disabled = false;
        prevBtn.disabled = true;
        autoBtn.disabled = false;
        
        // Actualizar mensaje
        resultMessage.textContent = 'Visualización lista. Presiona "Siguiente" para ver el proceso paso a paso.';
        resultMessage.style.color = 'var(--text)';
    }
    
    // Función para verificar si un número es palíndromo y registrar los pasos
    function isPalindromeWithSteps(x) {
        const steps = [];
        
        // Guardar el valor original para referencia
        const originalValue = x;
        
        // Paso 1: Comprobar casos especiales
        steps.push({
            type: 'check_special',
            message: `Comprobando casos especiales para ${x}`,
            x: x,
            reversed_half: 0,
            operation: null,
            result: null,
            details: 'Verificando casos que no pueden ser palíndromos'
        });
        
        // Los números negativos no son palíndromos
        if (x < 0) {
            steps.push({
                type: 'negative',
                message: `${x} es negativo, por lo tanto no puede ser palíndromo`,
                x: x,
                reversed_half: 0,
                operation: 'x < 0',
                result: true,
                details: 'Los números negativos no son palíndromos debido al signo'
            });
            
            return {
                isPalindrome: false,
                steps: steps,
                reason: 'negative'
            };
        }
        
        // Los números que terminan en 0 (excepto el 0 mismo) no son palíndromos
        if (x > 0 && x % 10 === 0) {
            steps.push({
                type: 'ends_with_zero',
                message: `${x} termina en 0 y no es 0, por lo tanto no puede ser palíndromo`,
                x: x,
                reversed_half: 0,
                operation: 'x > 0 && x % 10 === 0',
                result: true,
                details: 'Los números que terminan en 0 (excepto el 0) no son palíndromos'
            });
            
            return {
                isPalindrome: false,
                steps: steps,
                reason: 'ends_with_zero'
            };
        }
        
        // Caso especial: el número 0 es palíndromo
        if (x === 0) {
            steps.push({
                type: 'zero',
                message: `${x} es 0, que es un palíndromo`,
                x: x,
                reversed_half: 0,
                operation: 'x === 0',
                result: true,
                details: 'El número 0 es un palíndromo'
            });
            
            return {
                isPalindrome: true,
                steps: steps,
                reason: 'zero'
            };
        }
        
        // Paso 2: Revertir la mitad del número
        let reversed_half = 0;
        
        steps.push({
            type: 'init_reverse',
            message: `Iniciando la inversión de la mitad de ${x}`,
            x: x,
            reversed_half: reversed_half,
            operation: null,
            result: null,
            details: 'Vamos a invertir la mitad del número usando operaciones matemáticas'
        });
        
        // Bucle para revertir la mitad del número
        while (x > reversed_half) {
            // Paso 2.1: Obtener el último dígito
            const lastDigit = x % 10;
            
            steps.push({
                type: 'get_last_digit',
                message: `Obteniendo el último dígito de ${x}`,
                x: x,
                reversed_half: reversed_half,
                operation: `${x} % 10`,
                result: lastDigit,
                details: 'Usamos el operador módulo (%) para obtener el último dígito'
            });
            
            // Paso 2.2: Agregar el último dígito al número invertido
            const prev_reversed = reversed_half;
            reversed_half = reversed_half * 10 + lastDigit;
            
            steps.push({
                type: 'add_to_reversed',
                message: `Agregando el dígito ${lastDigit} al número invertido`,
                x: x,
                reversed_half: reversed_half,
                operation: `${prev_reversed} * 10 + ${lastDigit}`,
                result: reversed_half,
                details: 'Multiplicamos por 10 y sumamos el último dígito'
            });
            
            // Paso 2.3: Eliminar el último dígito del número original
            const prev_x = x;
            x = Math.floor(x / 10);
            
            steps.push({
                type: 'remove_last_digit',
                message: `Eliminando el último dígito de ${prev_x}`,
                x: x,
                reversed_half: reversed_half,
                operation: `Math.floor(${prev_x} / 10)`,
                result: x,
                details: 'Dividimos por 10 y tomamos solo la parte entera'
            });
            
            // Paso 2.4: Comprobar condición de bucle
            steps.push({
                type: 'check_loop',
                message: `Comprobando si continuar el bucle: ${x} > ${reversed_half}`,
                x: x,
                reversed_half: reversed_half,
                operation: `${x} > ${reversed_half}`,
                result: x > reversed_half,
                details: 'Verificamos si hemos procesado la mitad de los dígitos'
            });
        }
        
        // Paso 3: Comparar para determinar si es palíndromo
        // Para números con cantidad par de dígitos (como 1221), x == reversed_half
        // Para números con cantidad impar de dígitos (como 12321), x == reversed_half // 10
        
        const isEqualDirect = x === reversed_half;
        
        steps.push({
            type: 'compare_direct',
            message: `Comparando directamente: ${x} === ${reversed_half}`,
            x: x,
            reversed_half: reversed_half,
            operation: `${x} === ${reversed_half}`,
            result: isEqualDirect,
            details: 'Para números con cantidad par de dígitos'
        });
        
        const isEqualOdd = x === Math.floor(reversed_half / 10);
        
        steps.push({
            type: 'compare_odd',
            message: `Comparando para dígitos impares: ${x} === ${Math.floor(reversed_half / 10)}`,
            x: x,
            reversed_half: reversed_half,
            operation: `${x} === Math.floor(${reversed_half} / 10)`,
            result: isEqualOdd,
            details: 'Para números con cantidad impar de dígitos, quitamos el dígito central'
        });
        
        const isPalindrome = isEqualDirect || isEqualOdd;
        
        steps.push({
            type: 'final_result',
            message: `Resultado final: ${originalValue} ${isPalindrome ? 'es' : 'no es'} un palíndromo`,
            x: x,
            reversed_half: reversed_half,
            operation: `${isEqualDirect} || ${isEqualOdd}`,
            result: isPalindrome,
            details: isPalindrome ? 
                `${originalValue} se lee igual de izquierda a derecha y de derecha a izquierda` : 
                `${originalValue} no se lee igual en ambas direcciones`
        });
        
        return {
            isPalindrome: isPalindrome,
            steps: steps,
            reason: isPalindrome ? (isEqualDirect ? 'even_digits' : 'odd_digits') : 'not_palindrome'
        };
    }
    
    // Generar pasos de animación
    function generateAnimationSteps(num) {
        // Ejecutar el algoritmo y obtener los pasos
        const result = isPalindromeWithSteps(num);
        
        // Guardar los pasos para la animación
        animationSteps = result.steps;
    }
    
    // Mostrar paso anterior
    function showPrevStep() {
        if (currentStep > 0) {
            // Reducir el paso actual
            currentStep--;
            
            // Actualizar controles
            nextBtn.disabled = false;
            autoBtn.disabled = false;
            if (currentStep === 0) {
                prevBtn.disabled = true;
            }
            
            // Mostrar el paso actual
            updateVisualization();
        }
    }
    
    // Mostrar siguiente paso
    function showNextStep() {
        if (currentStep < animationSteps.length - 1) {
            // Incrementar el paso actual
            currentStep++;
            
            // Actualizar controles
            prevBtn.disabled = false;
            if (currentStep === animationSteps.length - 1) {
                nextBtn.disabled = true;
                if (autoPlayInterval) {
                    clearInterval(autoPlayInterval);
                    autoPlayInterval = null;
                    autoBtn.innerHTML = '<span class="btn-icon">▶️</span><span>Auto</span>';
                }
                autoBtn.disabled = true;
            }
            
            // Mostrar el paso actual
            updateVisualization();
        }
    }
    
    // Actualizar visualización según el paso actual
    function updateVisualization() {
        if (currentStep < 0 || currentStep >= animationSteps.length) return;
        
        const step = animationSteps[currentStep];
        
        // Actualizar valores de X y reversed_half
        if (step.x !== undefined) {
            originalNumber.textContent = step.x;
        }
        
        if (step.reversed_half !== undefined) {
            reversedNumber.textContent = step.reversed_half;
        }
        
        // Actualizar mensaje de resultado
        resultMessage.textContent = step.message;
        
        // Mostrar operación actual en el proceso
        updateProcessSteps();
        
        // Mostrar comparación final si es el último paso
        if (step.type === 'final_result') {
            comparisonContainer.style.display = 'block';
            const isPalindrome = step.result;
            
            comparisonDetails.innerHTML = `
                <div class="${isPalindrome ? 'is-palindrome' : 'not-palindrome'}">
                    ${step.message}
                </div>
                <p>${step.details}</p>
            `;
        } else {
            comparisonContainer.style.display = 'none';
        }
    }
    
    // Actualizar los pasos del proceso
    function updateProcessSteps() {
        // Limpiar pasos anteriores
        processSteps.innerHTML = '';
        
        // Agregar todos los pasos hasta el actual
        for (let i = 0; i <= currentStep; i++) {
            const step = animationSteps[i];
            
            // Omitir pasos sin operación específica
            if (!step.operation && !step.details) continue;
            
            const stepElement = document.createElement('div');
            stepElement.className = 'step';
            if (i === currentStep) stepElement.classList.add('active');
            
            let stepContent = '';
            
            if (step.operation) {
                stepContent += `
                    <div class="operation-label">Operación:</div>
                    <div class="operation-value">${step.operation}</div>
                `;
                
                if (step.result !== null && step.result !== undefined) {
                    stepContent += `
                        <div class="operation-label">Resultado:</div>
                        <div class="operation-value"><span class="highlight">${step.result}</span></div>
                    `;
                }
            }
            
            if (step.details) {
                stepContent += `
                    <div class="operation-label">Explicación:</div>
                    <div class="operation-value">${step.details}</div>
                `;
            }
            
            stepElement.innerHTML = stepContent;
            processSteps.appendChild(stepElement);
        }
        
        // Hacer scroll al último paso
        if (processSteps.lastChild) {
            processSteps.lastChild.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    // Reiniciar visualización
    function resetVisualization() {
        // Reiniciar valores
        originalNumber.textContent = '';
        reversedNumber.textContent = '0';
        processSteps.innerHTML = '';
        comparisonDetails.innerHTML = '';
        comparisonContainer.style.display = 'none';
        
        // Reiniciar mensaje
        resultMessage.textContent = 'Ingresa un número y presiona "Verificar palíndromo"';
        resultMessage.style.color = 'var(--text)';
        
        // Reiniciar controles
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        autoBtn.disabled = true;
        autoBtn.innerHTML = '<span class="btn-icon">▶️</span><span>Auto</span>';
        
        // Detener auto play si está activo
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
        
        // Reiniciar paso actual
        currentStep = -1;
        animationSteps = [];
    }
});
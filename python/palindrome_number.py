"""
Palindrome Number
Complejidad Temporal: O(log n) - procesamos la mitad de los dígitos
Complejidad Espacial: O(1) - usamos un número constante de variables

Autor: Elizabeth Diaz Familia
"""

def isPalindrome(x: int) -> bool:
    """
    Determina si un entero es un palíndromo sin convertirlo a string.
    Un palíndromo se lee igual de izquierda a derecha y de derecha a izquierda.
    
    Args:
        x: int - El número entero a evaluar
        
    Returns:
        bool - True si el número es palíndromo, False en caso contrario
    """
    # Casos especiales:
    # - Los números negativos no son palíndromos (debido al signo)
    # - Los números que terminan en 0 no son palíndromos (excepto el 0 mismo)
    if x < 0 or (x > 0 and x % 10 == 0):
        return False
    
    # Para el caso especial x = 0
    if x == 0:
        return True
    
    reversed_half = 0
    original = x
    
    # Revertir la mitad del número
    while x > reversed_half:
        # Obtener el último dígito
        last_digit = x % 10
        
        # Agregar el último dígito al número invertido
        reversed_half = reversed_half * 10 + last_digit
        
        # Eliminar el último dígito del número original
        x //= 10
    
    # Para números con dígitos pares (como 1221), x == reversed_half
    # Para números con dígitos impares (como 12321), eliminamos el dígito central con reversed_half // 10
    return x == reversed_half or x == reversed_half // 10


# Ejemplos de prueba
if __name__ == "__main__":
    # Ejemplo 1: x = 121 -> true
    print(f"Ejemplo 1 (121): {isPalindrome(121)}")
    
    # Ejemplo 2: x = -121 -> false
    print(f"Ejemplo 2 (-121): {isPalindrome(-121)}")
    
    # Ejemplo 3: x = 10 -> false
    print(f"Ejemplo 3 (10): {isPalindrome(10)}")
    
    # Ejemplo 4: x = 1234321 -> true
    print(f"Ejemplo 4 (1234321): {isPalindrome(1234321)}")
    
    # Ejemplo 5: x = 12344321 -> true
    print(f"Ejemplo 5 (12344321): {isPalindrome(12344321)}")
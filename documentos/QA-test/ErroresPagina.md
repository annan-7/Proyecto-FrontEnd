# Errores encontrados en la página

> Fecha de documentación: 14/10/2026 desde la 1:10am hasta las 4:30am aproximadamente

## Errores encontrados manualmente:

### - Al enviar un mensaje a "Contacto" sigue dando error 404 - Prioridad Alta 🔴
  <img width="1009" height="527" alt="image" src="https://github.com/user-attachments/assets/4ba152f9-653d-428d-9a9b-68341ae846e3" />
- En celulares la página de error 404 se ve un poco cortada en la parte de arriba - ? Prioridad Baja 🟡
  <img width="478" height="586" alt="image" src="https://github.com/user-attachments/assets/183f85b4-2922-433b-990e-1e6a3f672b34" />

> Pese a que el ejemplo está con un modelo específico de celular, pasa más que solo en ese. Probé con todos los modelos que aparecen más mi teléfono personal y seguía viéndose cortado.

## Errores encontrados con Axe DevTools:

### Página principal:

 ### Se encontraron 6 errores, 5 de ellos provienen del contraste de color de los elementos del footer en la página principal. - Prioridad Alta 🔴
<img width="278" height="294" alt="image" src="https://github.com/user-attachments/assets/6e8f0b23-6e2c-4d6b-bfc1-b0418461878b" />
<img width="1301" height="125" alt="image" src="https://github.com/user-attachments/assets/11a274d4-10fd-45dd-b41d-42eba0b2a324" />

### El sexto error tiene que ver con garantizar que las listas están estructuradas correctamente, el fallo también se encontró en el footer. - Según el programa: Prioridad Alta 🔴
 
 <img width="267" height="467" alt="image" src="https://github.com/user-attachments/assets/2decd456-8480-4ea9-8913-a7568f9ca146" />

### Página "Rutas":

 ### - Se encontraron 2 errores, ambos de lo mismo; contraste de color en el detalle de dificultad "Medio" - Prioridad Alta 🔴
 
<img width="457" height="441" alt="image" src="https://github.com/user-attachments/assets/0964bbd4-7650-422b-94e1-f15d69502c1f" />

### Página "Contacto":

 ### La página debe tener un encabezado de nivel 1 - Prioridad Media 🟠
<img width="282" height="364" alt="image" src="https://github.com/user-attachments/assets/66bf18f4-9d1e-4d02-976c-982af9b027e9" />

### Página "Sobre Nosotros":

 ### La página presenta 5 errores, todos acerca de "garantizar que el atributo role tiene un valor apropiado para el elemento". - Prioridad Baja 🟡
 <img width="268" height="378" alt="image" src="https://github.com/user-attachments/assets/f9ed6255-92c0-401c-97b2-cd7e0b84128a" />
 <img width="208" height="142" alt="image" src="https://github.com/user-attachments/assets/8b4bc369-61ed-4499-a1e2-14799144cb2a" />

> Tiene que ver con las tarjetas de los miembros del equipo y que tienen asignado un rol que no deben, siendo ese el rol de listitem.

### Página de error 404:

 #### La página presenta 6 problemas respecto a contraste;
 5 De ellos provienen del footer:
 <img width="1272" height="293" alt="image" src="https://github.com/user-attachments/assets/9150b89a-bb9d-4308-aa10-c890d1013145" />
<img width="218" height="302" alt="image" src="https://github.com/user-attachments/assets/752ad163-f089-4d1c-ba9a-eaa4b60fc4f4" />

 El sexto del color del número 404:
 <img width="1287" height="448" alt="image" src="https://github.com/user-attachments/assets/61bcd75b-067b-4f49-92b2-0e6bb069f88b" />

> Todos Prioridad Alta 🔴

 #### 1 error de que falta el atributo html "lang":
 <img width="266" height="427" alt="image" src="https://github.com/user-attachments/assets/28d4cc42-39e5-45d5-901d-6248b4c3b286" />

> Prioridad Alta 🔴 (al menos según Axe DevTools)

 #### 1 error de "garantizar que las listas están estructuradas correctamente":
<img width="1297" height="472" alt="image" src="https://github.com/user-attachments/assets/7e1dfa01-b882-48a3-aac4-bc3c42a7d23d" />

> Es el mismo error de la página principal - Prioridad Alta 🔴 (también según Axe DevTools)

###### Hay más errores encontrados con Axe DevTools (de hecho recién encontré un error crítico), pero son las 4:27am y ya me dio sueño. Voy a seguir mañana pero lo subo para que quede constancia de mi avance.
 
## Detalles pequeños en la página:
> Son cosas que no afectan realmente al funcionamiento de la página, solo a lo visual o la información que contiene cada parte.

### - Mientras que en el header aparece la sección "Sobre Nosotros" en el footer aparece solo como "Nosotros". 

   Header: <img width="392" height="55" alt="image" src="https://github.com/user-attachments/assets/913ef81b-3f19-49b4-8a23-9b791cb2c826" />

   Footer: <img width="333" height="47" alt="image" src="https://github.com/user-attachments/assets/5f04f55d-c75c-4d18-b3a9-89299b533418" /> 


### - El copyright debe decir el nombre de la marca, no una frase de la marca. - Prioridad Baja 🟡

  Página ECORUTA: <img width="514" height="42" alt="image" src="https://github.com/user-attachments/assets/506ab5aa-33db-4102-8d63-8bb41c53c501" />

  Página de Disney (ejemplo 1): <img width="233" height="24" alt="image" src="https://github.com/user-attachments/assets/6a97a626-997e-4498-bf86-310840825c35" />

  Página de Cencosud (ejemplo 2): <img width="378" height="35" alt="image" src="https://github.com/user-attachments/assets/8104764a-5a1e-4a55-8a5c-55c4f3255bc7" />
 
### - Las direcciones de las rutas son muy vagos. - Prioridad Baja 🟡

Esto es tema meramente de meterse en el rol de hacer la página útil más allá de solo funcional, pero creo que no está realmente en la rúbrica o algo así.
Sin embargo, si prefieren tener la dirección más específica de las rutas o más información al respecto yo podría buscar información.

### - Logo de ECORUTA muy pequeño - Prioridad Baja 🟡

COMANDO DE PARA LEVANTAR EL SERVER  npm run dev

EJECUTAR LA BASE DE DATOS QUE ES EN DatabaseConDatos.sql

EJEMPLO DE CCOMO ACCEDER A LOS EMPOINS 

GET 

http://localhost:3000/dietas/23


POST 

http://localhost:3000/doctores/CrearPaciente 
(LA INFO EN BODY SE PUEDE VER LA EXTRUCUTRA DE COMO SON LOS DATOS EN LOS CONTROLADORES )

PUT

http://localhost:3000/doctores

   {
       "id_doctor":15,
       "especialidad":"RadiograffiaNuevo",
       "numero_colegiado": "aaa22Nuevo",
       "telefono":"72625524Nuevo"
    }


(EL ID DEL CAMPO A ACTUALIZAR VA EN EL BDOY)


DELETE

http://localhost:3000/dietas/1


CONFIGURAR LOS DATOS DEL MYSQL EN LAS ENV ADEMAS DEL PUERTO LA PLANTILLA ESTA EN .env.templade
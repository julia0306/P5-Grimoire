# Mon vieux Grimoire
![Project Cover](https://i.ibb.co/Z8cwWGF/MVG.png)
## Description

L'objectif de ce projet était, à partir d'un front-end pré-existant, de créer un back-end qui s'intègre bien à celui-ci.  Pour y parvenir, il a fallu: 
- réaliser les modèles de données appropriés (Mongoose)
- instaurer une authentification sécurisée avec bcrypt.
- créer et gérer les routes de l'API nécessaires au bon fonctionnement de l'application
- faciliter l'envoi de fichiers à notre API  grâce à Multer 
- implémenter une base de données avec MongoDB
- prendre en compte le Green IT et veiller à l'optimisation des images, grâce à Sharp

---
## Configuration et installation

Pour exécuter ce projet localement, il sera nécessaire de configurer les variables d'environnement. 

### 1. Cloner le dépôt en local 
Clonez le projet à l'aide de la commande  
<center><b>git clone</b></center>
  

### 2. Installer les dépendances 
Installez les dépendances à l'aide de la commande  
<center><b>npm install</b></center> 
  

### 3. Configurer les variables d'environnement 

A la racine du projet, copiez le fichier .env.example dans un nouveau fichier .env. 
Pour cela, vous pouvez utiliser la commande suivante: <center><b>cp .env.example .env</b></center>

A l'intérieur de ce fichier .env, renseignez la variable d'environnement suivante en y inscrivant une nouvelle valeur :
<center><b>TOKEN_SECRET= "Valeur_à_inscrire_ici"</b></center>

___

##  Démarrage du serveur

Vous pourrez alors démarrer le serveur de développement Node grâce à la commande suivante: 
<center><b>nodemon serve</b></center> 

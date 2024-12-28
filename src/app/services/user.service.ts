import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';

/**
 * Este serviço gerencia operações CRUD na coleção "users" do Firestore.
 */
@Injectable({
  providedIn: 'root', // O serviço será injetado globalmente em toda a aplicação Angular.
})
export class UserService {
  /**
   * Configuração da aplicação Firebase. 
   * Aqui são definidas as credenciais para inicializar a conexão com o Firebase.
   */
  firebaseConfig = initializeApp({
    apiKey: 'AIzaSyByOg2LiR7zIWh9SvLMfJmMGLJOZXz-RlQ', // Chave de API usada para autenticação com o Firebase.
    authDomain: 'teste-angular-firebase-788da.firebaseapp.com', // Domínio autorizado para autenticação.
    projectId: 'teste-angular-firebase-788da', // ID do projeto Firebase.
  });

  /**
   * Instância do Firestore usada para executar operações na base de dados.
   */
  db = getFirestore(this.firebaseConfig);

  /**
   * Referência para a coleção "users" no Firestore.
   * Todas as operações de leitura, escrita, atualização e exclusão serão realizadas nessa coleção.
   */
  userCollectionRef = collection(this.db, 'users');

  /**
   * Retorna todos os documentos da coleção "users".
   * returns Uma lista de objetos contendo os dados de cada usuário, incluindo o ID.
   */
  async getUsers() {
    // Obtém todos os documentos da coleção.
    const dataColletion = await getDocs(this.userCollectionRef);

    // Mapeia os dados dos documentos e inclui o ID de cada documento.
    const data = dataColletion.docs.map((doc) => ({
      ...doc.data(), // Dados contidos no documento (ex.: name, email).
      id: doc.id,    // ID do documento.
    }));

    return data; // Retorna a lista completa de usuários.
  }

  /**
   * Adiciona um novo usuário à coleção "users".
   * param name Nome do usuário a ser adicionado.
   * param email Email do usuário a ser adicionado.
   */
  criarUser(name: string, email: string) {
    // Adiciona um novo documento na coleção "users" com os dados fornecidos.
    addDoc(this.userCollectionRef, { name, email });
  }

  /**
   * Deleta um usuário da coleção "users" pelo ID.
   * param id ID do usuário a ser deletado.
   */
  deletarUser(id: string) {
    // Cria uma referência para o documento específico que será excluído.
    const userDocRef = doc(this.userCollectionRef, id);

    // Solicita confirmação do usuário antes de deletar.
    const confirmar = confirm('Tem certeza que deseja excluir este usuário?');

    if (confirmar) {
      deleteDoc(userDocRef); // Deleta o documento do Firestore.
    }
  }

  /**
   * Atualiza os dados de um usuário específico na coleção "users".
   * param name Novo nome do usuário.
   * param email Novo email do usuário.
   * param id ID do usuário a ser atualizado.
   */
  Atualizar(name: string, email: string, id: string) {
    // Cria uma referência para o documento específico que será atualizado.
    const userDocRef = doc(this.userCollectionRef, id);

    // Atualiza os campos "name" e "email" do documento com os novos valores.
    updateDoc(userDocRef, {
      name: name,
      email: email,
    });
  }
}

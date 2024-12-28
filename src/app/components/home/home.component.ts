import { Component, OnInit } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home', // Identificador usado para renderizar este componente em outro HTML.
  standalone: true, // Define que este é um componente autônomo.
  imports: [FormsModule, CommonModule], // Importa módulos necessários para formulários e diretivas comuns.
  templateUrl: './home.component.html', // Caminho para o arquivo de template HTML.
  styleUrls: ['./home.component.scss'], // Caminho para o arquivo de estilos CSS.
})
export class HomeComponent implements OnInit {
  // Declaração das propriedades do componente.
  name: string = ''; // Armazena o nome do usuário para cadastro.
  email: string = ''; // Armazena o email do usuário para cadastro.
  users: any[] = []; // Lista de usuários carregados do Firebase.
  isModalOpen = false; // Controla a visibilidade do modal de edição.
  selectedUser: any = {}; // Usuário selecionado para edição.

  // Configuração do Firebase.
  firebaseConfig = initializeApp({
    apiKey: 'AIzaSyByOg2LiR7zIWh9SvLMfJmMGLJOZXz-RlQ', // Chave de API do Firebase.
    authDomain: 'teste-angular-firebase-788da.firebaseapp.com', // Domínio autorizado para autenticação.
    projectId: 'teste-angular-firebase-788da', // ID do projeto no Firebase.
  });

  db = getFirestore(this.firebaseConfig); // Obtém uma instância do Firestore.
  userCollectionRef = collection(this.db, 'users'); // Referência para a coleção 'users' no Firestore.

  // Injeta o serviço UserService para lidar com operações de usuários.
  constructor(readonly userService: UserService) {}

  // Método executado ao inicializar o componente.
  ngOnInit() {
    this.getUsers(); // Carrega a lista de usuários ao iniciar o componente.
  }

  // Carrega todos os usuários do Firestore e os armazena na propriedade `users`.
  getUsers() {
    this.userService.getUsers().then((data) => {
      this.users = data; // Atualiza a lista de usuários.
    });
  }

  // Abre o modal de edição e copia os dados do usuário selecionado.
  abrirModal(user: any) {
    this.selectedUser = { ...user }; // Clona o objeto do usuário.
    this.isModalOpen = true; // Define o modal como visível.
  }

  // Fecha o modal de edição e limpa os dados do usuário selecionado.
  fecharModal() {
    this.isModalOpen = false; // Define o modal como invisível.
    this.selectedUser = {}; // Limpa os dados do usuário selecionado.
  }

  // Confirma a atualização do usuário selecionado.
  confirmarAtualizacao() {
    this.userService.Atualizar(
      this.selectedUser.name, // Nome atualizado.
      this.selectedUser.email, // Email atualizado.
      this.selectedUser.id // ID do usuário a ser atualizado.
    );
    console.log('Usuário atualizado com sucesso!'); // Log de sucesso.
    this.getUsers(); // Atualiza a lista de usuários.
    this.fecharModal(); // Fecha o modal após a atualização.
  }

  // Metodo de Atualização usado anteriormente sem o service
  // confirmarAtualizacao() {
  //   const userDocRef = doc(this.userCollectionRef, this.selectedUser.id);
  //   updateDoc(userDocRef, {
  //     name: this.selectedUser.name,
  //     email: this.selectedUser.email,
  //   })
  //     .then(() => {
  //       console.log('Usuário atualizado com sucesso!');
  //       this.getUsers(); // Atualiza a lista de usuários
  //     })
  //     .catch((error) => console.error('Erro ao atualizar usuário:', error));
  //   this.fecharModal();
  // }

  // Adiciona um novo usuário ao Firestore.
  criarUser(name: string, email: string) {
    if (name.trim().length === 0) {
      alert("O campo 'Nome' é obrigatório.");
      return;
    }
    if (email.trim().length === 0) {
      alert("O campo 'Email' é obrigatório.");
      return;
    }
    if (!this.validarEmail(email)) {
      alert('Por favor, insira um endereço de email válido.');
      return;
    }
    this.userService.criarUser(name, email); // Chama o método do serviço para criar o usuário.
    this.getUsers(); // Atualiza a lista de usuários.
    this.name = ''; // Limpa o campo de entrada do nome.
    this.email = ''; // Limpa o campo de entrada do email.
  }
  // Método para validar formato de email.
  validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  // Deleta um usuário do Firestore.
  deletarUser(id: string) {
    this.userService.deletarUser(id); // Chama o método do serviço para deletar o usuário.
    this.getUsers(); // Atualiza a lista de usuários.
  }
}

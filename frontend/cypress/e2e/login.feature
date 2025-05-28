Feature: User Login
  As a user
  I want to sign in to my account
  So that I can access my dashboard
  And receive a response 

  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I enter my email "test@test.com"
    And I enter my password "password"
    Then I should see the message "Welcome back"
    And I should see the message "Sign in to your account" 